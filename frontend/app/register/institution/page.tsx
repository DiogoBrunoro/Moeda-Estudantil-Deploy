// app/register/institution/page.tsx
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import Link from "next/link"
import { useNotification } from "@/context/NotificationContext"
import apiUrl from "../../../api/apiUrl";

export default function InstitutionRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      showNotification("As senhas não coincidem", "error");
      setLoading(false)
      return
    }

    try {
      // Endpoint para registrar a instituição (ajuste se necessário)
      const response = await fetch(`${apiUrl}/auth/register/instituicao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          cnpj: formData.cnpj,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        showNotification(data.error || "Erro ao criar instituição", "error");
        setLoading(false)
        return
      }

      showNotification("Instituição criado com sucesso!", "success");
      router.push("/login") // Redireciona para o login após o sucesso
    } catch (err) {
      console.error(err)
      showNotification("Erro ao conectar com o servidor", "error");
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <AuthLayout title="Cadastro de Instituição" subtitle="Crie a conta para sua instituição de ensino">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <TextField
            label="Nome da Instituição"
            value={formData.name}
            onChange={(v) => updateField("name", v)}
            placeholder="Universidade Exemplo"
            required
          />

          <TextField
            label="CNPJ"
            value={formData.cnpj}
            onChange={(v) => updateField("cnpj", v)}
            placeholder="00.000.000/0001-00"
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
            placeholder="contato@instituicao.com"
            required
          />

          <TextField
            label="Senha"
            type="password"
            value={formData.password}
            onChange={(v) => updateField("password", v)}
            placeholder="••••••••"
            required
          />

          <TextField
            label="Confirmar senha"
            type="password"
            value={formData.confirmPassword}
            onChange={(v) => updateField("confirmPassword", v)}
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="text-white w-full mt-5" disabled={loading}>
          {loading ? "Criando conta..." : "Criar conta"}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-base text-gray-500">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}