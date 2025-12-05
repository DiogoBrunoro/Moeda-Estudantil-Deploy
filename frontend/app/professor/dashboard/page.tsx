"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import TransactionItem from "@/components/transaction-item"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/types"
import { Balance } from "@mui/icons-material"
import apiUrl from "../../../api/apiUrl";

interface Professor {
  nome: string
  saldo_moedas: number
  departamento: string
  total_send: number
  total_receive: number
  transacoes_enviadas: Transaction[]
}

export default function ProfessorDashboard() {
  const router = useRouter()
  const [professor, setProfessor] = useState<Professor>({
    nome: "",
    saldo_moedas: 0,
    departamento: "",
    total_send: 0,
    total_receive: 0,
    transacoes_enviadas: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token não encontrado")

        // 🔹 1️⃣ Buscar perfil do professor
        const resPerfil = await fetch(`${apiUrl}/professor/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!resPerfil.ok) throw new Error("Erro ao buscar perfil do professor")
        const perfilData = await resPerfil.json()

        // 🔹 2️⃣ Buscar extrato de transações
        const resExtrato = await fetch(`${apiUrl}/professor/extrato`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!resExtrato.ok) throw new Error("Erro ao buscar transações")
        const extratoData = await resExtrato.json()

        // 🔹 3️⃣ Atualiza o estado com perfil + transações
        setProfessor({
          nome: perfilData.nome || "",
          saldo_moedas: perfilData.saldo_moedas || 0,
          departamento: perfilData.departamento || "",
          transacoes_enviadas: extratoData || [],
          total_receive: perfilData.total_receive,
          total_send: perfilData.total_send
        })
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading)
    return (
      <DashboardLayout userType="professor" userName="Carregando...">
        <div className="text-center mt-10">Carregando dados do professor...</div>
      </DashboardLayout>
    )

  if (error)
    return (
      <DashboardLayout userType="professor" userName="Erro">
        <div className="text-center mt-10 text-red-600">{error}</div>
      </DashboardLayout>
    )

  return (
    <DashboardLayout userType="professor" userName={professor.nome} balance={professor.saldo_moedas}>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Bem-vindo, {professor.nome}!</h1>
          <p className="text-blue-100 text-lg">Reconheça o mérito dos seus alunos distribuindo moedas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Saldo Disponível"
            value={professor.saldo_moedas}
            icon={
              <Balance></Balance>
            }
          />
          <StatCard
            title="Moedas Distribuídas"
            value={professor.transacoes_enviadas.reduce((acc, t) => acc + (t.valor || 0), 0)}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            }
          />
          <StatCard
            title="Alunos Reconhecidos"
            value={professor.transacoes_enviadas.length}
            icon={
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">Reconheça seus alunos</h2>
            <p className="text-green-50 text-lg leading-relaxed">
              Envie moedas para recompensar participação, dedicação e excelência acadêmica
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/professor/send")}>
            <div className="flex items-center gap-2 px-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Enviar Moedas
            </div>
          </Button>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Envios Recentes</h2>
            <a href="/professor/transactions" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              Ver extrato completo →
            </a>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
            {professor.transacoes_enviadas.length > 0 ? (
              professor.transacoes_enviadas.slice(0, 5).map(tx => (
                <TransactionItem key={tx.id} transaction={tx} userType="professor"/>
              ))
            ) : (
              <p className="p-4 text-gray-500">Nenhuma transação encontrada</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
