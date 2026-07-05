import { Resend } from "resend"
import type { EmailAdapter } from "./server-type"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const emailAdapter: EmailAdapter = {
  async send(to, message) {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: process.env.EMAIL_SUBJECT ?? "Notification",
      text: message,
    })
    if (error) throw new Error(error.message)
  },
}
