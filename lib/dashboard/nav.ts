export type NavItem = { label: string; href: string }

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/dashboard" },
  { label: "Facturation", href: "/dashboard/billing" },
  { label: "Réglages", href: "/dashboard/compte" },
]
