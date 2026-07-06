import type { CheckoutMode } from "./server-type"

export interface Plan {
  id: string
  name: string
  priceId: string
  mode: CheckoutMode
}

export const plans: Plan[] = [
  { id: "pro", name: "Pro", priceId: process.env.STRIPE_PRICE_PRO ?? "", mode: "subscription" },
]

export function findPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id)
}
