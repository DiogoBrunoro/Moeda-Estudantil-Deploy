"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, Paper, Grid, Alert, Divider } from "@mui/material"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button from "@/components/button"
import { useRouter } from "next/navigation"

const institutions = [
  { value: "ufmg", label: "Universidade Federal de Minas Gerais" },
  { value: "usp", label: "Universidade de São Paulo" },
  { value: "unicamp", label: "Universidade Estadual de Campinas" },
]

const departments = [
  { value: "cs", label: "Ciência da Computação" },
  { value: "se", label: "Engenharia de Software" },
  { value: "is", label: "Sistemas de Informação" },
  { value: "ee", label: "Engenharia Elétrica" },
  { value: "math", label: "Matemática" },
]

export default function EditProfessorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Mock data - would come from API
  const [formData, setFormData] = useState({
    name: "Dr. João Silva",
    email: "joao.silva@universidade.edu.br",
    cpf: "123.456.789-00",
    department: "cs",
    institution: "ufmg",
    balance: "850",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push("/admin/professors")
    }, 2000)
  }

  const handleAddBalance = async () => {
    setLoading(true)
    // Simulate adding 1000 coins
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setFormData((prev) => ({
      ...prev,
      balance: String(Number(prev.balance) + 1000),
    }))
    setLoading(false)
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Editar Professor
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Atualize os dados do professor
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Professor atualizado com sucesso! Redirecionando...
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid container spacing={3} component="div">
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Dados Pessoais
              </Typography>
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="Nome Completo"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e)}
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="Email Institucional"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e)}
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="CPF"
                required
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e)}
                disabled
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Dados Acadêmicos
              </Typography>
            </Grid>

            <Grid container spacing={3} component="div">
              <SelectField
                label="Instituição"
                required
                value={formData.institution}
                onChange={(e) => handleChange("institution", e)}
                options={institutions}
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <SelectField
                label="Departamento"
                required
                value={formData.department}
                onChange={(e) => handleChange("department", e)}
                options={departments}
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Saldo de Moedas
              </Typography>
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="Saldo Atual"
                type="number"
                value={formData.balance}
                onChange={(e) => handleChange("balance", e)}
                helperText="Ajuste manual do saldo (use com cuidado)"
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
                <Button variant="outline" onClick={handleAddBalance} disabled={loading}>
                  + Adicionar 1000 Moedas (Novo Semestre)
                </Button>
              </Box>
            </Grid>

            <Grid container spacing={3} component="div">
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button type="submit" disabled={loading} className="min-w-[200px]">
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button variant="outline" onClick={() => router.push("/admin/professors")} disabled={loading}>
                  Cancelar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  )
}
