import type { AuthAdapter } from "./server-type"

export const authAdapter: AuthAdapter = {
  async getSession() {
    return null
  },
  async signOut() {},
}
