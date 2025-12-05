"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionItem from "@/components/transaction-item"
import type { Professor, Transaction } from "@/types"
import apiUrl from "../../../api/apiUrl";

export default function ProfessorTransactionsPage() {
  const [filter, setFilter] = useState<"all" | "send" | "receive">("all")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [professor, setProfessor] = useState<Professor>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        // 1️⃣ Busca perfil do professor
        const profileRes = await fetch(`${apiUrl}/professor/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!profileRes.ok) throw new Error("Erro ao carregar perfil")
        const profileData = await profileRes.json()
        console.log("ProfileData", profileData)
        setProfessor(profileData)

        const transRes = await fetch(`${apiUrl}/professor/extrato`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!transRes.ok) throw new Error("Erro ao carregar extrato")

        const transData: Transaction[] = await transRes.json()
        transData.forEach((t) => console.log(t.aluno_id))
  

      setTransactions(transData)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message) 
        } else {
          setError("Erro desconhecido") 
        }
      }finally {
        setLoading(false) 
      }
      
    }

    fetchData()
  }, [])

  type FilterType = "all" | "send" | "receive";

  const filteredTransactions = transactions.filter(
    (t) => filter === "all" || (filter === "send" && t.aluno_id) || (filter === "receive" && !t.aluno_id)
  );

  // Total de transações "enviadas" (com aluno_id)
  const totalSent = professor?.total_send

  // Total de transações "recebidas" (sem aluno_id, conforme sua regra)
  const totalReceived = professor?.total_receive

  if (loading) {
    return (
      <DashboardLayout userType="professor" userName="Carregando..." balance={0}>
        <p className="text-gray-500">Carregando dados...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="professor" userName="Erro" balance={0}>
        <p className="text-red-500">Erro: {error}</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      userType="professor"
      userName={professor?.nome}
      balance={professor?.saldo_moedas}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Extrato de Transações</h1>
          <p className="text-gray-500">Acompanhe todas as suas movimentações</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
            <p className="text-3xl font-bold text-gray-700">{professor?.saldo_moedas}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Distribuído</p>
            <p className="text-3xl font-bold text-red-500">{totalSent}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Recebido</p>
            <p className="text-3xl font-bold text-green-500">+{totalReceived}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter("send")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "send"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Enviadas
            </button>
            <button
              onClick={() => setFilter("receive")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "receive"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              Recebidas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} userType="professor" />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhuma transação encontrada</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
