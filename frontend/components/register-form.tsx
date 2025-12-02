"use client"

import { useState } from "react"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button from "@/components/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import apiUrl from "../api/apiUrl";

interface RegisterFormProps {
  type: "aluno" | "empresa"
}

interface StudentFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  cpf: string
  rg: string
  address: string
  institution: string
  course: string
}

interface CompanyFormData {
  companyName: string
  cnpj: string
  email: string
  address: string
  description: string
  password: string
  confirmPassword: string
}

const mockInstitutions = [
  { value: "puc", label: "PUC Minas" },
  { value: "ufmg", label: "UFMG" },
  { value: "uemg", label: "UEMG" },
]

const mockCourses = [
  { value: "eng-software", label: "Engenharia de Software" },
  { value: "ciencia-comp", label: "Ciência da Computação" },
  { value: "sistemas-info", label: "Sistemas de Informação" },
  { value: "adm", label: "Administração" },
]

export default function RegisterForm({ type }: RegisterFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // 🔹 Tipagem explícita aqui resolve o erro
  const [formData, setFormData] = useState<StudentFormData | CompanyFormData>(
    type === "aluno"
      ? {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          cpf: "",
          rg: "",
          address: "",
          institution: "",
          course: "",
        }
      : {
          companyName: "",
          cnpj: "",
          email: "",
          address: "",
          description: "",
          password: "",
          confirmPassword: "",
        }
  )

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      if (type === "aluno") {
        const student = formData as StudentFormData

        const response = await fetch(`${apiUrl}/auth/register/aluno`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: student.name,
            email: student.email,
            password: student.password,
            cpf: student.cpf,
            rg: student.rg,
            endereco: student.address,
            instituicao_ensino_id: 1,
            curso: student.course,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Erro ao criar aluno")
        }
      } else {
        const company = formData as CompanyFormData

        const response = await fetch(`${apiUrl}/auth/register/empresa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: company.companyName,
            email: company.email,
            password: company.password,
            cnpj: company.cnpj,
            endereco: company.address,
            descricao: company.description,
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Erro ao criar empresa")
        }
      }

      alert(`${type === "aluno" ? "Aluno" : "Empresa"} criado com sucesso!`)
      router.push("/login")
    } catch (err: any) {
      alert(err.message || "Erro ao conectar com o servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === "aluno" ? (
        <>
          <TextField
            label="Nome completo"
            value={(formData as StudentFormData).name}
            onChange={(v) => updateField("name", v)}
            placeholder="João da Silva"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={(formData as StudentFormData).email}
            onChange={(v) => updateField("email", v)}
            placeholder="joao@email.com"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="CPF"
              value={(formData as StudentFormData).cpf}
              onChange={(v) => updateField("cpf", v)}
              placeholder="000.000.000-00"
              required
            />
            <TextField
              label="RG"
              value={(formData as StudentFormData).rg}
              onChange={(v) => updateField("rg", v)}
              placeholder="MG-00.000.000"
              required
            />
          </div>
          <TextField
            label="Endereço"
            value={(formData as StudentFormData).address}
            onChange={(v) => updateField("address", v)}
            placeholder="Rua, número, bairro, cidade"
            required
          />
          <SelectField
            label="Instituição de Ensino"
            value={(formData as StudentFormData).institution}
            onChange={(v) => updateField("institution", v)}
            options={mockInstitutions}
            placeholder="Selecione sua instituição"
            required
          />
          <SelectField
            label="Curso"
            value={(formData as StudentFormData).course}
            onChange={(v) => updateField("course", v)}
            options={mockCourses}
            placeholder="Selecione seu curso"
            required
          />
        </>
      ) : (
        <>
          <TextField
            label="Nome da Empresa"
            value={(formData as CompanyFormData).companyName}
            onChange={(v) => updateField("companyName", v)}
            placeholder="Empresa LTDA"
            required
          />
          <TextField
            label="CNPJ"
            value={(formData as CompanyFormData).cnpj}
            onChange={(v) => updateField("cnpj", v)}
            placeholder="00.000.000/0000-00"
            required
          />
          <TextField
            label="Email corporativo"
            type="email"
            value={(formData as CompanyFormData).email}
            onChange={(v) => updateField("email", v)}
            placeholder="contato@empresa.com"
            required
          />
          <TextField
            label="Endereço"
            value={(formData as CompanyFormData).address}
            onChange={(v) => updateField("address", v)}
            placeholder="Rua, número, bairro, cidade"
            required
          />
          <TextField
            label="Descrição da empresa"
            value={(formData as CompanyFormData).description}
            onChange={(v) => updateField("description", v)}
            placeholder="Conte um pouco sobre sua empresa..."
            required
          />
        </>
      )}

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

      <Button type="submit">
        {loading ? "Criando conta..." : "Criar conta"}
      </Button>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  )
}
