"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import apiUrl from "../../../api/apiUrl";

export default function AlunoProfilePage() {
  const [loading, setLoading] = useState(true)
  const [aluno, setAluno] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false) 
  const [isDeleting, setIsDeleting] = useState(false) 
  

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    rg: "",
    email: "",
    endereco: "",
    curso: "",
    instituicaoEnsino: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          alert("Token não encontrado. Faça login novamente.")
          return
        }

        const response = await fetch(`${apiUrl}/aluno/perfil`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Erro ao buscar perfil do aluno")

        const data = await response.json()
        setAluno(data)

        setFormData({
          nome: data.nome || "",
          cpf: data.cpf || "",
          rg: data.rg || "",
          email: data.user?.email || "",
          endereco: data.endereco || "",
          curso: data.curso || "",
          instituicaoEnsino: data.instituicao_ensino?.nome || "Não informada",
        })
      } catch (err) {
        console.error("❌ Erro ao buscar perfil:", err)
        alert("Não foi possível carregar os dados do aluno.")
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
    setIsSaving(true) 
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiUrl}/aluno`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          rg: formData.rg,
          endereco: formData.endereco,
          curso: formData.curso,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erro ao salvar alterações.")
      }

      alert("Dados atualizados com sucesso!")
      setEditMode(false)
      window.location.reload()
    } catch (err) {
      console.error("❌ Erro ao salvar:", err)
    } finally {
      setIsSaving(false) 
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Tem certeza que deseja deletar sua conta? Esta ação é irreversível.",
      )
    ) {
      return
    }

    setIsDeleting(true) // <-- ATIVA O LOADING
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${apiUrl}/aluno`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Erro ao deletar conta.")
      }

      alert("Conta deletada com sucesso!")
      localStorage.removeItem("token")
      window.location.href = "/login"
    } catch (err) {
      console.error("❌ Erro ao deletar:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Carregando...">
        <div className="text-center mt-20 text-gray-500">
          Carregando informações...
        </div>
      </DashboardLayout>
    )
  }

  if (!aluno) {
    return (
      <DashboardLayout userType="student" userName="Erro">
        <div className="text-center mt-20 text-red-500">
          Erro ao carregar os dados do aluno.
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="student" userName={aluno.nome || "Aluno"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-gray-500">Gerencie suas informações de estudante</p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-border space-y-6">
          <TextField
            label="Nome Completo"
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

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="CPF"
              value={formData.cpf}
              onChange={(v) => handleChange("cpf", v)}
              readOnly={!editMode}
            />
            <TextField
              label="RG"
              value={formData.rg}
              onChange={(v) => handleChange("rg", v)}
              readOnly={!editMode}
            />
          </div>

          <TextField
            label="Endereço"
            value={formData.endereco}
            onChange={(v) => handleChange("endereco", v)}
            readOnly={!editMode}
          />

          <TextField
            label="Curso"
            value={formData.curso}
            onChange={(v) => handleChange("curso", v)}
            readOnly={!editMode}
          />

          <TextField
            label="Instituição de Ensino"
            value={formData.instituicaoEnsino}
            readOnly
            onChange={() => {}}
            className="bg-gray-100"
          />

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {editMode ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditMode(false)}
                    disabled={isSaving || isDeleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || isDeleting}
                  >
                    {isSaving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setEditMode(true)}>
                  Editar dados
                </Button>
              )}
            </div>

            {editMode && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={isSaving || isDeleting}
              >
                {isDeleting ? "Deletando..." : "Deletar conta"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}