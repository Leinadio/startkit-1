export interface Session {
  userId: string
  email: string
}

export interface AuthAdapter {
  getSession(): Promise<Session | null>
  signOut(): Promise<void>
}