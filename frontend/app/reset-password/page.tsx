"use client"

import React, { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import AuthForm from "@/components/auth-form"
import TextField from "@/components/text-field"
import { useNotification } from "@/context/NotificationContext"
import apiUrl from "../../api/apiUrl";

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showNotification } = useNotification()
  
  // Captura o token da URL ?token=...
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      showNotification("Token de recuperação não encontrado ou inválido.", "error")
    }
  }, [token, showNotification])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      showNotification("Token inválido. Solicite uma nova recuperação.", "error")
      return
    }

    if (password !== confirmPassword) {
      showNotification("As senhas não coincidem.", "error")
      return
    }

    if (password.length < 6) {
      showNotification("A senha deve ter no mínimo 6 caracteres.", "error")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification(data.error || "Erro ao redefinir senha", "error")
        return
      }

      showNotification("Senha redefinida com sucesso! Redirecionando...", "success")
      
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err) {
      console.error(err)
      showNotification("Erro ao conectar com o servidor", "error")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
     return (
        <AuthLayout title="Erro" subtitle="Link inválido">
            <div className="text-center text-red-600 mb-4">
                O token de recuperação é obrigatório. Por favor, utilize o link enviado para o seu email.
            </div>
            <button 
                onClick={() => router.push("/forgot-password")}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
            >
                Solicitar novo link
            </button>
        </AuthLayout>
     )
  }

  return (
    <AuthLayout 
      title="Criar nova senha" 
      subtitle="Digite sua nova senha abaixo"
    >
      <AuthForm onSubmit={handleSubmit} loading={loading} buttonText="Redefinir Senha">
        <TextField
          label="Nova Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
        <TextField
          label="Confirme a Nova Senha"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          required
        />
      </AuthForm>
    </AuthLayout>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}