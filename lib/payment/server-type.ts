export type CheckoutMode = "payment" | "subscription"

export interface CheckoutInput {
  userId: string
  email: string
  priceId: string
  mode: CheckoutMode
}

export interface UrlResult {
  url: string
}

export interface Subscription {
  status: string
  priceId: string
  currentPeriodEnd: Date
}

export interface PaymentAdapter {
  createCheckout(input: CheckoutInput): Promise<UrlResult>
  createBillingPortal(userId: string): Promise<UrlResult>
  getSubscription(userId: string): Promise<Subscription | null>
  handleWebhook(req: Request): Promise<void>
}