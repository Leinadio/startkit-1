export interface EmailAdapter {
  send(to: string, message: string): Promise<void>
}
