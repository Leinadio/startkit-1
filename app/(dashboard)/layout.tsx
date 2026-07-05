import { redirect } from "next/navigation"
import { authAdapter } from "@/lib/auth/server"
import { SidebarProvider, SidebarInset } from "@/ui/sidebar"
import { AppSidebar } from "@/ui/app-sidebar"
import { DashboardTopbar } from "@/ui/dashboard-topbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await authAdapter.getSession()
  if (!session) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardTopbar />
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
