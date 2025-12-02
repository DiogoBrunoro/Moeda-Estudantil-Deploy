"use client"

import { Box, Typography, Paper } from "@mui/material"

export default function InstitutionsPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Gerenciar Instituições
      </Typography>

      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Funcionalidade em desenvolvimento
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Em breve você poderá gerenciar instituições de ensino
        </Typography>
      </Paper>
    </Box>
  )
}
