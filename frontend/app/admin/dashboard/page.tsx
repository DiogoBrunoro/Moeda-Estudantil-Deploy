"use client"

import { Box, Typography, Grid, Paper } from "@mui/material"
import StatCard from "@/components/stat-card"

import PeopleIcon from '@mui/icons-material/People'; 
import SchoolIcon from '@mui/icons-material/School'; 
import BusinessIcon from '@mui/icons-material/Business';

export default function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard Administrativo
      </Typography>

      <Grid container spacing={3}>
        <Grid container spacing={3}>
          <StatCard title="Total de Professores" icon={<PeopleIcon />} value="45" subtitle="Ativos no sistema" color="#1976d2" />
        </Grid>
        <Grid container spacing={3}>
          <StatCard title="Total de Alunos" icon={<SchoolIcon />} value="1,234" subtitle="Cadastrados" color="#2e7d32" />
        </Grid>
        <Grid container spacing={3}>
          <StatCard title="Empresas Parceiras" icon={<BusinessIcon />} value="12" subtitle="Ativas" color="#ed6c02" />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Atividades Recentes
        </Typography>
        <Typography color="text.secondary">
          Visualize e gerencie professores, alunos e instituições através do menu lateral.
        </Typography>
      </Paper>
    </Box>
  )
}
