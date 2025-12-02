"use client"

import { useState } from "react"
import Link from "next/link"
import AuthLayout from "@/components/auth-layout"
import AuthForm from "@/components/auth-form"
import TextField from "@/components/text-field"
import { useNotification } from "@/context/NotificationContext"
import apiUrl from "../../api/apiUrl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { showNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Endpoint sugerido baseada no seu padrão de login
      const res = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        showNotification(data.error || "Erro ao solicitar recuperação", "error")
        return
      }

      showNotification("Email de recuperação enviado!", "success")
      setEmailSent(true)

    } catch (err) {
      console.error(err)
      showNotification("Erro ao conectar com o servidor", "error")
    } finally {
      setLoading(false)
    }
  }

  // Renderiza tela de confirmação se o email já foi enviado
  if (emailSent) {
    return (
      <AuthLayout 
        title="Verifique seu email" 
        subtitle={`Enviamos as instruções de recuperação para ${email}`}
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-center text-gray-600">
            Caso não encontre o email na sua caixa de entrada, verifique também a caixa de spam ou lixo eletrônico.
          </p>
          
          <Link 
            href="/login" 
            className="w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar para o Login
          </Link>
          
          <button 
            onClick={() => setEmailSent(false)}
            className="text-sm text-center text-blue-600 hover:underline"
          >
            Tentar outro email
          </button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Esqueceu a senha?" 
      subtitle="Digite seu email para receber um link de redefinição"
    >
      <AuthForm onSubmit={handleSubmit} loading={loading} buttonText="Enviar Link">
        <TextField
          label="Email cadastrado"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="seu@email.com"
          required
        />

        <div className="flex items-center justify-center mt-6">
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            <span aria-hidden="true">&larr;</span> Voltar para o Login
          </Link>
        </div>
      </AuthForm>
    </AuthLayout>
  )
}