import type { PaymentAdapter } from "./server-type"

export const paymentAdapter: PaymentAdapter = {
  async handleWebhook() {
    throw new Error("Aucun module de paiement installé")
  },
}
