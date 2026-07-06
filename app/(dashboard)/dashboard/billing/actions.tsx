"use client"
import { useEffect, useState } from "react"
import { clientBus } from "@/lib/events/client"
import { Button } from "@/ui/button"

type PlanView = { id: string; name: string }

export function BillingActions({
  plans,
  subscribed,
  userId,
}: {
  plans: PlanView[]
  subscribed: boolean
  userId: string
}) {
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("checkout") === "success") {
      setMessage("Paiement confirmé. Merci !")
      clientBus.emit("payment.succeeded", { userId, amount: 0 })
    }
  }, [userId])

  const go = async (path: string, body?: object) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <div className="space-y-3">
      {message ? <p className="text-sm text-green-600">{message}</p> : null}
      {subscribed ? (
        <Button className="w-full" onClick={() => go("/api/payment/portal")}>
          Gérer mon abonnement
        </Button>
      ) : (
        plans.map((p) => (
          <Button key={p.id} className="w-full" onClick={() => go("/api/payment/checkout", { planId: p.id })}>
            Souscrire {p.name}
          </Button>
        ))
      )}
    </div>
  )
}
