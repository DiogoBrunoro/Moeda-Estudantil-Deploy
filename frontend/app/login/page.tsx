// app/login/page.tsx (Modificado)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import AuthForm from "@/components/auth-form"
import TextField from "@/components/text-field"
import { useNotification } from "@/context/NotificationContext"
import apiUrl from "../../api/apiUrl";



export default function Page() {
  const [loginField, setLoginField] = useState("") // Mudei de 'email' para 'loginField'
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showNotification } = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No backend, o handler de login deve verificar se 'login' é email ou cnpj
        body: JSON.stringify({ email: loginField, password }),
      })
      console.log("Body", loginField, password)
      console.log("Resposta do login:", res)

      const data = await res.json()

      if (!res.ok) {
        showNotification(data.error || "Erro ao fazer login", "error");
        setLoading(false)
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.user.role)

      if (data.user.role === "aluno") {
        router.push("/student/dashboard")
      } else if (data.user.role === "empresa") {
        router.push("/company/dashboard")
      } else if (data.user.role === "instituicao") {
        router.push("/institution/dashboard")
      } else if (data.user.role === "professor") {
        router.push("/professor/dashboard")
      } else {
        router.push("/")
      }

    } catch (err) {
      console.error(err)
      showNotification("Erro ao conectar com o servidor", "error");
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre na sua conta para continuar">
      <AuthForm onSubmit={handleSubmit} loading={loading} buttonText="Entrar">
        <TextField
          label="Email ou CNPJ"
          type="text" // Mudei o tipo para aceitar CNPJ
          value={loginField}
          onChange={setLoginField}
          placeholder="seu@email.com ou 00.000.000/0001-00" // Mudei o placeholder
          required
        />
        {/* === FIM DA MODIFICAÇÃO === */}
        <TextField
          label="Senha"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
      </AuthForm>
    </AuthLayout>
  )
}