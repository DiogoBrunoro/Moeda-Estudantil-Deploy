import type React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { label: "Professores", href: "/admin/professors", icon: "👨‍🏫" },
    { label: "Instituições", href: "/admin/institutions", icon: "🏛️" },
  ]

  return (
    <DashboardLayout userType="admin" userName="Administrador" menuItems={menuItems}>
      {children}
    </DashboardLayout>
  )
}
