"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import AdvantageCard from "@/components/advantage-card"
import RedemptionItem from "@/components/redemption-item"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import type { Advantage, Redemption } from "@/types"

export default function CompanyDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState<any>(null)
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])

  // 🔹 Busca o nome da empresa e as vantagens pelo token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          alert("Token não encontrado. Faça login novamente.")
          return
        }

        // Buscar perfil da empresa
        const profileRes = await fetch("http://localhost:8080/api/empresa/perfil", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!profileRes.ok) throw new Error("Erro ao buscar perfil da empresa")

        const profileData = await profileRes.json()
        setCompany(profileData)

        // Buscar vantagens
        const advantagesRes = await fetch("http://localhost:8080/api/empresa/vantagens", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (advantagesRes.ok) {
          const data = await advantagesRes.json()
          if (Array.isArray(data)) {
            setAdvantages(data)
          } else {
            console.warn("⚠️ Resposta inesperada de vantagens:", data)
            setAdvantages([])
          }
        }

        // Buscar resgates
        const redemptionsRes = await fetch("http://localhost:8080/api/empresa/resgates", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (redemptionsRes.ok) {
          const data = await redemptionsRes.json()
          // 🔹 Trata qualquer formato de resposta (objeto ou array)
          if (Array.isArray(data)) {
            setRedemptions(data)
          } else if (Array.isArray(data.resgates)) {
            setRedemptions(data.resgates)
          } else {
            console.warn("⚠️ Resposta inesperada de resgates:", data)
            setRedemptions([])
          }
        }
      } catch (err) {
        console.error("❌ Erro ao carregar dados:", err)
        alert("Erro ao carregar dados da empresa.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCompleteRedemption = (redemption: Redemption) => {
    alert(`Resgate confirmado!\n\nCódigo: ${redemption.code}\nAluno: ${redemption.studentName}`)
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
        <div className="text-center mt-20 text-red-500">
          Erro ao carregar os dados da empresa.
        </div>
      </DashboardLayout>
    )
  }

  // 🔹 Garante que redemptions sempre seja um array antes de usar filter
  const redemptionsArray = Array.isArray(redemptions) ? redemptions : []
  const pendingCount = redemptionsArray.filter((r) => r.status === "pending").length

  return (
    <DashboardLayout userType="company" userName={company.nome || "Empresa"}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, {company.nome}!
          </h1>
          <p className="text-gray-500">
            Gerencie suas vantagens e acompanhe os resgates
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Vantagens Ativas"
            value={advantages.length}
            icon={
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            }
          />

          <StatCard
            title="Total de Resgates"
            value={redemptionsArray.length}
            icon={
              <svg
                className="w-6 h-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />

          <StatCard
            title="Pendentes"
            value={pendingCount}
            icon={
              <svg
                className="w-6 h-6 text-warning"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-br from-secondary to-primary rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Cadastre novas vantagens</h2>
              <p className="text-white/90">
                Atraia mais estudantes oferecendo benefícios exclusivos
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => router.push("/company/advantages/new")}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Nova Vantagem
              </div>
            </Button>
          </div>
        </div>

        {/* My Advantages */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Minhas Vantagens</h2>
            <a
              href="/company/advantages"
              className="text-primary font-medium hover:underline"
            >
              Ver todas
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, index) => (
  <AdvantageCard
    key={advantage.id ?? `adv-${index}`}
    advantage={{
      ...advantage,
      id: String(advantage.id ?? index),
    }}
  />
))}

          </div>
        </div>

        {/* Recent Redemptions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Resgates Recentes</h2>
            <a
              href="/company/redemptions"
              className="text-primary font-medium hover:underline"
            >
              Ver todos
            </a>
          </div>

          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            {redemptionsArray.length > 0 ? (
              redemptionsArray.map((r) => (
                <RedemptionItem
                  key={r.id}
                  redemption={r}
                  onComplete={handleCompleteRedemption}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                Nenhum resgate encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
