"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material"
import Button from "@/components/button"
import { useRouter } from "next/navigation"

// Mock data
const mockProfessors = [
  {
    id: "1",
    name: "Dr. João Silva",
    email: "joao.silva@universidade.edu.br",
    cpf: "123.456.789-00",
    department: "Ciência da Computação",
    institution: "Universidade Federal",
    balance: 850,
    status: "active",
  },
  {
    id: "2",
    name: "Profa. Maria Santos",
    email: "maria.santos@universidade.edu.br",
    cpf: "987.654.321-00",
    department: "Engenharia de Software",
    institution: "Universidade Federal",
    balance: 1000,
    status: "active",
  },
  {
    id: "3",
    name: "Dr. Carlos Oliveira",
    email: "carlos.oliveira@universidade.edu.br",
    cpf: "456.789.123-00",
    department: "Sistemas de Informação",
    institution: "Universidade Federal",
    balance: 200,
    status: "active",
  },
]

export default function ProfessorsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProfessors = mockProfessors.filter(
    (prof) =>
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Gerenciar Professores
        </Typography>
        <Button onClick={() => router.push("/admin/professors/new")}>+ Cadastrar Professor</Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Buscar por nome, email ou departamento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600 }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>CPF</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Departamento</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Saldo</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProfessors.map((professor) => (
              <TableRow key={professor.id} hover>
                <TableCell>{professor.name}</TableCell>
                <TableCell>{professor.email}</TableCell>
                <TableCell>{professor.cpf}</TableCell>
                <TableCell>{professor.department}</TableCell>
                <TableCell>
                  <Chip
                    label={`${professor.balance} moedas`}
                    size="small"
                    color={professor.balance > 500 ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <Chip label="Ativo" size="small" color="success" variant="outlined" />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => router.push(`/admin/professors/${professor.id}`)}>
                    ✏️
                  </IconButton>
                  <IconButton size="small" color="error">
                    🗑️
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredProfessors.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <Typography color="text.secondary">Nenhum professor encontrado</Typography>
        </Paper>
      )}
    </Box>
  )
}
