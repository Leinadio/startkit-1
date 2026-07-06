import { describe, it, expect } from "vitest"
import { paymentAdapter } from "@/lib/payment/server-stub"

describe("payment server-stub", () => {
  it("rejette createCheckout quand aucun module n'est installé", async () => {
    await expect(
      paymentAdapter.createCheckout({ userId: "u", email: "a@b.fr", priceId: "p", mode: "subscription" }),
    ).rejects.toThrow()
  })
  it("rejette createBillingPortal", async () => {
    await expect(paymentAdapter.createBillingPortal("u")).rejects.toThrow()
  })
  it("rejette handleWebhook", async () => {
    await expect(paymentAdapter.handleWebhook(new Request("http://x"))).rejects.toThrow()
  })
  it("renvoie null pour getSubscription", async () => {
    await expect(paymentAdapter.getSubscription("u")).resolves.toBeNull()
  })
})
