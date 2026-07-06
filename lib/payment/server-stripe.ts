import Stripe from "stripe"
import { prisma } from "@/lib/database/server-supabase"
import { emailAdapter } from "@/lib/email/server"
import type { PaymentAdapter } from "./server-type"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-06-24.dahlia" })
const baseUrl = process.env.BETTER_AUTH_URL!

// Retourne true si l'abonnement a été créé (nouvelle ligne), false s'il existait déjà.
// Sert à ne pas renvoyer l'email de confirmation quand Stripe rejoue l'évènement.
async function upsertSubscription(userId: string, sub: Stripe.Subscription): Promise<boolean> {
  const existing = await prisma.subscription.findUnique({ where: { userId } })
  const item = sub.items.data[0]
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: sub.id,
      status: sub.status,
      priceId: item.price.id,
      currentPeriodEnd: new Date(item.current_period_end * 1000),
    },
    update: {
      stripeSubscriptionId: sub.id,
      status: sub.status,
      priceId: item.price.id,
      currentPeriodEnd: new Date(item.current_period_end * 1000),
    },
  })
  return !existing
}

export const paymentAdapter: PaymentAdapter = {
  async createCheckout({ userId, email, priceId, mode }) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      customer: user?.stripeCustomerId ?? undefined,
      customer_email: user?.stripeCustomerId ? undefined : email,
      success_url: `${baseUrl}/dashboard/billing?checkout=success`,
      cancel_url: `${baseUrl}/dashboard/billing`,
      metadata: { userId },
    })
    if (!session.url) throw new Error("Session Checkout sans URL")
    return { url: session.url }
  },

  async createBillingPortal(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.stripeCustomerId) throw new Error("Utilisateur sans compte de facturation")
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard/billing`,
    })
    return { url: session.url }
  },

  async getSubscription(userId) {
    const sub = await prisma.subscription.findUnique({ where: { userId } })
    if (!sub) return null
    return { status: sub.status, priceId: sub.priceId, currentPeriodEnd: sub.currentPeriodEnd }
  },

  async handleWebhook(req) {
    const signature = req.headers.get("stripe-signature")
    if (!signature) throw new Error("Signature Stripe manquante")
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object
      const userId = session.metadata?.userId
      if (!userId) {
        console.warn("Webhook Stripe sans metadata.userId, événement ignoré")
        return
      }
      let user
      if (typeof session.customer === "string") {
        user = await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: session.customer } })
      } else {
        user = await prisma.user.findUnique({ where: { id: userId } })
      }

      let isNewSubscription = false
      if (session.mode === "subscription" && typeof session.subscription === "string") {
        const sub = await stripe.subscriptions.retrieve(session.subscription)
        isNewSubscription = await upsertSubscription(userId, sub)
      }

      // Abonnement : email seulement à la création, pour éviter les doublons si Stripe rejoue l'évènement.
      // Paiement unique : pas de ligne à vérifier, on garde l'envoi simple.
      const shouldSendEmail = session.mode === "subscription" ? isNewSubscription : true
      if (user && shouldSendEmail) await emailAdapter.send(user.email, "Votre paiement a bien été reçu. Merci !")
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: { status: sub.status, currentPeriodEnd: new Date(sub.items.data[0].current_period_end * 1000) },
      })
    }
  },
}
