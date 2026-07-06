import { paymentAdapter } from "@/lib/payment/server"

export async function POST(req: Request) {
  try {
    await paymentAdapter.handleWebhook(req)
    return Response.json({ received: true })
  } catch (err) {
    console.error("Erreur webhook Stripe :", err)
    return new Response("Webhook rejeté", { status: 400 })
  }
}
