"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { resetPassword } from "@/lib/auth/client"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null | undefined>(undefined)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token"))
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      await resetPassword({ token, newPassword: password })
      router.push("/login")
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
          <CardTitle>Nouveau mot de passe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {token === undefined ? null : token === null ? (
            <p className="text-sm text-destructive">Lien invalide ou expiré.</p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Enregistrement…" : "Réinitialiser"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
