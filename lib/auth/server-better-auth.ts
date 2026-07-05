import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/database/server-supabase"
import { emailAdapter } from "@/lib/email/server"
import type { AuthAdapter } from "./server-type"
import { headers } from "next/headers"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      await emailAdapter.send(user.email, `Réinitialisez votre mot de passe : ${url}`)
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    linkedin: {
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    },
  },
  user: {
    changeEmail: { enabled: true },
    deleteUser: { enabled: true },
  },
})

export const authAdapter: AuthAdapter = {
  async getSession() {
    const result = await auth.api.getSession({ headers: await headers() })
    if (!result?.session) return null
    return { userId: result.user.id, email: result.user.email }
  },
  async signOut() {
    await auth.api.signOut({ headers: await headers() })
  },
}
