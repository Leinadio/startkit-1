import type { PaymentAdapter } from "./server-type"

const notInstalled = () => {
  throw new Error("Aucun module de paiement installé")
}

export const paymentAdapter: PaymentAdapter = {
  async createCheckout() {
    return notInstalled()
  },
  async createBillingPortal() {
    return notInstalled()
  },
  async getSubscription() {
    return null
  },
  async handleWebhook() {
    notInstalled()
  },
}
