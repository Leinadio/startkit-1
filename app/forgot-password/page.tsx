"use client"
import { useState } from "react"
import { requestPasswordReset } from "@/lib/auth/client"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await requestPasswordReset({ email })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <p className="text-sm text-muted-foreground">
              Si un compte existe pour cet email, un lien de réinitialisation vient d'être envoyé.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi…" : "Envoyer le lien"}
              </Button>
            </form>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <a className="underline" href="/login">Retour à la connexion</a>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
