"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import { Email } from "@mui/icons-material"

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    endereco: "",
    descricao: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          alert("Token não encontrado. Faça login novamente.")
          return
        }

        const response = await fetch("http://localhost:8080/api/empresa/perfil", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Erro ao buscar perfil da empresa")
        const data = await response.json()
        setCompany(data)
        setFormData({
          nome: data.nome,
          cnpj: data.cnpj,
          email: data.user?.email || "",
          endereco: data.endereco || "",
          descricao: data.descricao || "",
        })
      } catch (err) {
        console.error("❌ Erro ao buscar perfil:", err)
        alert("Não foi possível carregar os dados da empresa.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:8080/api/empresa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          endereco: formData.endereco,
          email: formData.email,
          cnpj: formData.cnpj,
          descricao: formData.descricao,
        }),
      })
      console.log("Response do salvar:", response)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erro ao salvar alterações.")
      }

      alert("Dados atualizados com sucesso!")
      setEditMode(false)
      window.location.reload()
    } catch (err) {
      console.error("❌ Erro ao salvar:", err)
      alert("Erro ao salvar alterações.")
    }
  }

  if (loading) {
    return (
      <DashboardLayout userType="company" userName="Carregando...">
        <div className="text-center mt-20 text-gray-500">Carregando informações...</div>
      </DashboardLayout>
    )
  }

  if (!company) {
    return (
      <DashboardLayout userType="company" userName="Erro">
        <div className="text-center mt-20 text-red-500">Erro ao carregar os dados da empresa.</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="company" userName={company.nome || "Empresa"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Perfil da Empresa</h1>
          <p className="text-muted">Gerencie as informações da sua conta parceira</p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-border space-y-6">
          <TextField
            label="Nome da empresa"
            value={formData.nome}
            onChange={(v) => handleChange("nome", v)}
            readOnly={!editMode}
          />

          <TextField
            label="Email"
            value={formData.email}
            onChange={(v) => handleChange("email", v)}
            readOnly={!editMode}
          />

          <TextField
            label="CNPJ"
            value={formData.cnpj}
            onChange={(v) => handleChange("cnpj", v)}
            readOnly={!editMode}
          />

          <TextField
            label="Endereço"
            value={formData.endereco}
            onChange={(v) => handleChange("endereco", v)}
            readOnly={!editMode}
          />

          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={(v) => handleChange("descricao", v)}
            multiline
            rows={4}
            readOnly={!editMode}
          />

          <div className="flex gap-4">
            {editMode ? (
              <>
                <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSave}>
                  Salvar alterações
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Atualizar
                </Button>
                <Button
                  type="button"
                  onClick={() => setEditMode(true)}
                >
                  Editar dados
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
