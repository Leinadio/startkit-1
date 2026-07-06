import { authAdapter } from "@/lib/auth/server"
import { paymentAdapter } from "@/lib/payment/server"
import { findPlan } from "@/lib/payment/plans"

export async function POST(req: Request) {
  const session = await authAdapter.getSession()
  if (!session) return new Response("Non autorisé", { status: 401 })
  const { planId } = await req.json()
  const plan = findPlan(planId)
  if (!plan) return new Response("Offre inconnue", { status: 400 })
  const { url } = await paymentAdapter.createCheckout({
    userId: session.userId,
    email: session.email,
    priceId: plan.priceId,
    mode: plan.mode,
  })
  return Response.json({ url })
}
