"use client"

import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">{/* <Logo size={40} /> */}</div>

          <div className="bg-white rounded-2xl shadow-lg p-12 space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
              {subtitle && <p className="text-lg text-muted-foreground mb-8">{subtitle}</p>}
            </div>

            {children}
          </div>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary to-secondary p-12 items-center justify-center">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-4 text-balance">Reconheça o mérito estudantil</h2>
          <p className="text-lg text-white/90 text-pretty">
            Uma plataforma inovadora que conecta alunos, professores e empresas através de um sistema de recompensas com
            moeda virtual.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">1000+</div>
              <div className="text-sm text-white/80">Alunos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-sm text-white/80">Professores</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-3xl font-bold mb-1">20+</div>
              <div className="text-sm text-white/80">Parceiros</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
