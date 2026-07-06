import { authAdapter } from "@/lib/auth/server"
import { paymentAdapter } from "@/lib/payment/server"
import { plans } from "@/lib/payment/plans"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { BillingActions } from "./actions"

export default async function BillingPage() {
  const session = await authAdapter.getSession()
  if (!session) return null
  const subscription = await paymentAdapter.getSubscription(session.userId)
  const subscribed = subscription?.status === "active"

  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Card>
        <CardHeader>
          <CardTitle>Facturation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscribed ? (
            <p className="text-sm text-muted-foreground">Abonnement actif.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Choisis une offre pour t'abonner.</p>
          )}
          <BillingActions
            plans={plans.map((p) => ({ id: p.id, name: p.name }))}
            subscribed={subscribed}
            userId={session.userId}
          />
        </CardContent>
      </Card>
    </main>
  )
}
