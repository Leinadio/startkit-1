import { authAdapter } from "@/lib/auth/server"
import { paymentAdapter } from "@/lib/payment/server"

export async function POST() {
  const session = await authAdapter.getSession()
  if (!session) return new Response("Non autorisé", { status: 401 })
  const { url } = await paymentAdapter.createBillingPortal(session.userId)
  return Response.json({ url })
}
