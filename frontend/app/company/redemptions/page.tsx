"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import RedemptionItem from "@/components/redemption-item"
import type { Redemption } from "@/types"
import { useNotification } from "@/context/NotificationContext"

const mockCompany = {
  name: "Tech Store",
  email: "contato@techstore.com",
}

const mockRedemptions: Redemption[] = [
  {
    id: "1",
    advantageId: "1",
    advantageTitle: "15% em acessórios tech",
    studentName: "João Silva",
    studentEmail: "joao@email.com",
    date: "05/01/2025",
    code: "TECH-A1B2C3",
    status: "pending",
  },
  {
    id: "2",
    advantageId: "2",
    advantageTitle: "R$ 100 em produtos",
    studentName: "Maria Santos",
    studentEmail: "maria@email.com",
    date: "03/01/2025",
    code: "TECH-D4E5F6",
    status: "completed",
  },
  {
    id: "3",
    advantageId: "1",
    advantageTitle: "15% em acessórios tech",
    studentName: "Pedro Oliveira",
    studentEmail: "pedro@email.com",
    date: "02/01/2025",
    code: "TECH-G7H8I9",
    status: "completed",
  },
  {
    id: "4",
    advantageId: "3",
    advantageTitle: "Mouse Gamer",
    studentName: "Ana Costa",
    studentEmail: "ana@email.com",
    date: "01/01/2025",
    code: "TECH-J1K2L3",
    status: "pending",
  },
  {
    id: "5",
    advantageId: "2",
    advantageTitle: "R$ 100 em produtos",
    studentName: "Carlos Lima",
    studentEmail: "carlos@email.com",
    date: "28/12/2024",
    code: "TECH-M4N5O6",
    status: "completed",
  },
]

export default function CompanyRedemptionsPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all")
  const { showNotification } = useNotification();

  const filteredRedemptions = mockRedemptions.filter((r) => filter === "all" || r.status === filter)

  const handleCompleteRedemption = (redemption: Redemption) => {
    showNotification(`Resgate confirmado!\n\nCódigo: ${redemption.code}\nAluno: ${redemption.studentName}`, "success")
  }

  const totalRedemptions = mockRedemptions.length
  const pendingRedemptions = mockRedemptions.filter((r) => r.status === "pending").length
  const completedRedemptions = mockRedemptions.filter((r) => r.status === "completed").length

  return (
    <DashboardLayout userType="company" userName={mockCompany.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resgates</h1>
          <p className="text-gray-500">Acompanhe e confirme os resgates das suas vantagens</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-md text-blue-600 mb-1">Total de Resgates</p>
            <p className="text-3xl font-bold text-foreground">{totalRedemptions}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-md text-blue-600 text-bold mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-">{pendingRedemptions}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-md text-blue-600 text-bold mb-1">Concluídos</p>
            <p className="text-3xl font-bold text-success">{completedRedemptions}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-primary text-white" : "bg-surface text-gray-500 hover:bg-border"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "pending" ? "bg-warning text-white" : "bg-surface text-gray-500 hover:bg-border"
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed" ? "bg-success text-white" : "bg-surface text-gray-500 hover:bg-border"
              }`}
            >
              Concluídos
            </button>
          </div>
        </div>

        {/* Redemptions List */}
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {filteredRedemptions.map((redemption) => (
            <RedemptionItem key={redemption.id} redemption={redemption} onComplete={handleCompleteRedemption} />
          ))}
        </div>

        {filteredRedemptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhum resgate encontrado</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
