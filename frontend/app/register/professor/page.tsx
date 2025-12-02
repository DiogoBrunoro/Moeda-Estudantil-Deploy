"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthLayout from "@/components/auth-layout"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button from "@/components/button"
import Link from "next/link"
import { useNotification } from "@/context/NotificationContext"

const mockInstitutions = [
  { value: "puc", label: "PUC Minas" },
  { value: "ufmg", label: "UFMG" },
  { value: "uemg", label: "UEMG" },
]

// Usando os mesmos mocks para departamentos, mas poderia ser uma lista diferente
const mockDepartments = [
  { value: "eng-software", label: "Engenharia de Software" },
  { value: "ciencia-comp", label: "Ciência da Computação" },
  { value: "sistemas-info", label: "Sistemas de Informação" },
  { value: "adm", label: "Administração" },
]

export default function ProfessorRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { showNotification } = useNotification()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    rg: "",
    address: "",
    institution: "",
    course: "", // Mantido como 'course' no estado, mas representa 'departamento'
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
      const response = await fetch("http://localhost:8080/api/auth/register/professor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf,
          rg: formData.rg,
          endereco: formData.address,
          instituicao_ensino_id: 1, // Mantendo o ID fixo como no exemplo do aluno
          departamento: formData.course, // Enviando como 'departamento'
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        showNotification(data.error || "Erro ao criar professor", "error");
        setLoading(false)
        return
      }

      showNotification("Professor criado com sucesso!", "success");
      router.push("/login")
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
    <AuthLayout title="Cadastro de Professor" subtitle="Preencha seus dados para criar sua conta">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <TextField
            label="Nome completo"
            value={formData.name}
            onChange={(v) => updateField("name", v)}
            placeholder="João da Silva"
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(v) => updateField("email", v)}
            placeholder="joao@email.com"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="CPF"
              value={formData.cpf}
              onChange={(v) => updateField("cpf", v)}
              placeholder="000.000.000-00"
              required
            />

            <TextField
              label="RG"
              value={formData.rg}
              onChange={(v) => updateField("rg", v)}
              placeholder="MG-00.000.000"
              required
            />
          </div>

          <TextField
            label="Endereço"
            value={formData.address}
            onChange={(v) => updateField("address", v)}
            placeholder="Rua, número, bairro, cidade"
            required
          />

          <SelectField
            label="Instituição de Ensino"
            value={formData.institution}
            onChange={(v) => updateField("institution", v)}
            options={mockInstitutions}
            placeholder="Selecione sua instituição"
            required
          />

          <SelectField
            label="Departamento"
            value={formData.course}
            onChange={(v) => updateField("course", v)}
            options={mockDepartments}
            placeholder="Selecione seu departamento"
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