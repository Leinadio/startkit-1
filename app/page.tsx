import { authAdapter } from "@/lib/auth/server"
import { Button } from "@/ui/button"

export default async function Home() {
  const session = await authAdapter.getSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-semibold">Starter Kit</h1>
      <p className="text-muted-foreground">
        {session ? `Connecté : ${session.email}` : "Invité"}
      </p>
      <div className="flex gap-3">
        {session ? (
          <Button render={<a href="/dashboard" />}>Aller au dashboard</Button>
        ) : (
          <>
            <Button render={<a href="/login" />}>Connexion</Button>
            <Button variant="outline" render={<a href="/signup" />}>Inscription</Button>
          </>
        )}
      </div>
    </main>
  )
}
