"use client"

import type React from "react"
import { useState } from "react"
// import Logo from "./logo"
import { useRouter } from "next/navigation"

interface MenuItem {
  label: string
  href: string
  icon: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "student" | "professor" | "company" | "admin"
  userName?: string
  balance?: number
  menuItems?: MenuItem[]
}

export function DashboardLayout({ children, userType, userName, balance, menuItems }: DashboardLayoutProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    router.push("/login")
  }

  const getNavItems = () => {
    if (menuItems) {
      return menuItems
    }

    switch (userType) {
      case "student":
        return [
          { label: "Dashboard", href: "/student/dashboard", icon: "home" },
          { label: "Vantagens", href: "/student/advantages", icon: "gift" },
          { label: "Extrato", href: "/student/transaction", icon: "list" },
          { label: "Perfil", href: "/student/perfil", icon: "user" },
        ]
      case "professor":
        return [
          { label: "Dashboard", href: "/professor/dashboard", icon: "home" },
          { label: "Enviar Moedas", href: "/professor/send", icon: "send" },
          { label: "Extrato", href: "/professor/transactions", icon: "list" },
        ]
      case "company":
        return [
          { label: "Dashboard", href: "/company/dashboard", icon: "home" },
          { label: "Vantagens", href: "/company/advantages", icon: "gift" },
          { label: "Resgates", href: "/company/redemptions", icon: "check" },
          { label: "Minha Empresa", href: "/company/myCompany", icon: "check" },
          { label: "Cadastro de Professor", href: "/company/registerProfessor", icon: "check" },
        ]
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard", icon: "home" },
          { label: "Professores", href: "/admin/professors", icon: "users" },
          { label: "Instituições", href: "/admin/institutions", icon: "building" },
        ]
    }
  }

  const navItems = getNavItems()

  const getUserTypeLabel = () => {
    switch (userType) {
      case "student":
        return "Aluno"
      case "professor":
        return "Professor"
      case "company":
        return "Empresa"
      case "admin":
        return "Administrador"
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* <Logo size={32} /> */}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-500 hover:text-foreground transition-colors font-medium"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {balance !== undefined && (
                <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-bold text-primary">{balance}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{getUserTypeLabel()}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 cursor-pointer hover:bg-surface text-gray-500 rounded-lg transition-colors"
                  title="Sair"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-surface rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}

export default DashboardLayout
