import { paymentAdapter } from "@/lib/payment/server"

export async function POST(req: Request) {
  try {
    await paymentAdapter.handleWebhook(req)
    return Response.json({ received: true })
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "Erreur webhook", { status: 400 })
  }
}
