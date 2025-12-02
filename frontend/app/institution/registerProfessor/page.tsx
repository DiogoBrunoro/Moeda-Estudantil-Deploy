"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button from "@/components/button"
import Link from "next/link"
import apiUrl from "../../../api/apiUrl";

const mockDepartments = [
  { value: "eng-software", label: "Engenharia de Software" },
  { value: "ciencia-comp", label: "Ciência da Computação" },
  { value: "sistemas-info", label: "Sistemas de Informação" },
  { value: "adm", label: "Administração" },
]

export default function ProfessorRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [institution, setInstitution] = useState<{ id: number; nome: string } | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    rg: "",
    address: "",
    course: "",
  })

  // 🔹 Carrega instituição do localStorage, se existir
  useEffect(() => {
    try {
      const storedInstitution = localStorage.getItem("instituicao")
      if (storedInstitution) {
        const parsed = JSON.parse(storedInstitution)
        setInstitution(parsed)
      }
    } catch (err) {
      console.error("Erro ao ler instituição do localStorage:", err)
    }
  }, [])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem")
      setLoading(false)
      return
    }

    // 🔹 Usa o ID do localStorage, se houver — senão, usa 1 por padrão
    const instituicaoId = institution?.id || 1

    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${apiUrl}/instituicao/professores`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // 🔹 aqui
        },
        body: JSON.stringify({
          nome: formData.name,
          email: formData.email,
          password: formData.password,
          cpf: formData.cpf,
          rg: formData.rg,
          endereco: formData.address,
          instituicao_ensino_id: instituicaoId,
          departamento: formData.course,
        }),
      })
      

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || "Erro ao criar professor")
        setLoading(false)
        return
      }

      alert("✅ Professor criado com sucesso!")
    } catch (err) {
      console.error("❌ Erro:", err)
      alert("Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout userType="admin" userName={institution?.nome || "Instituição"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Cadastro de Professor
          </h1>
          <p className="text-muted">
            Preencha os campos abaixo para cadastrar um novo professor vinculado à sua instituição.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 border border-border space-y-6"
        >
          {institution ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
              <p>
                <strong>Instituição vinculada:</strong> {institution.nome}
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
              <p>
                Nenhuma instituição encontrada no navegador — usando <strong>ID 1</strong> como padrão.
              </p>
            </div>
          )}

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
            label="Departamento"
            value={formData.course}
            onChange={(v) => updateField("course", v)}
            options={mockDepartments}
            placeholder="Selecione seu departamento"
            required
          />

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex justify-end items-center pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
