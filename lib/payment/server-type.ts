export interface PaymentAdapter {
  handleWebhook(req: Request): Promise<void>
}