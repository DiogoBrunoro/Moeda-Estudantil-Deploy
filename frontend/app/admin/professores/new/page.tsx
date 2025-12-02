"use client"

import type React from "react"

import { useState } from "react"
import { Box, Typography, Paper, Grid, Alert } from "@mui/material"
import TextField from "@/components/text-field"
import SelectField from "@/components/select-field"
import Button  from "@/components/button"
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

export default function NewProfessorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    department: "",
    institution: "",
    initialBalance: "1000",
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        Cadastrar Novo Professor
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Preencha os dados para pré-cadastrar um professor no sistema
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Professor cadastrado com sucesso! Redirecionando...
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
                placeholder="Ex: Dr. João Silva"
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="Email Institucional"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e)}
                placeholder="professor@universidade.edu.br"
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="CPF"
                required
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e)}
                placeholder="000.000.000-00"
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
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
              <Typography variant="h6" sx={{ mb: 2, mt: 2, fontWeight: 600 }}>
                Configurações Iniciais
              </Typography>
            </Grid>

            <Grid container spacing={3} component="div">
              <TextField
                label="Saldo Inicial de Moedas"
                type="number"
                required
                value={formData.initialBalance}
                onChange={(e) => handleChange("initialBalance", e)}
                helperText="Professores recebem 1000 moedas por semestre"
              />
            </Grid>

            <Grid container spacing={3} component="div">
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button type="submit" disabled={loading} className="min-w-[200px]">
                  {loading ? "Cadastrando..." : "Cadastrar Professor"}
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
