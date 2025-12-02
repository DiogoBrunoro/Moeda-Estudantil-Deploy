"use client"

import { SetStateAction, useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TransactionItem from "@/components/transaction-item"
import type { Student, Transaction } from "@/types"
import { getAlunoData, getExtrato } from "@/api/alunoApi"

// removed local mocks; using real API data

export default function StudentTransactionsPage() {
  const [filter, setFilter] = useState<"all" | "receive" | "redeem">("all")
  const [aluno, setAluno] = useState<Student|null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
     useEffect(() => {
      const fetchAluno = async () => {
        setIsLoading(true);
        setError(null); 
  
        try {
          const alunoBuscado = await getAlunoData(); 
          console.log(alunoBuscado)
          if(alunoBuscado === null) {
            setError("Não foi possível carregar os dados do aluno.");
            setAluno(null);
          } else {
            console.log("Dados do aluno buscados:", alunoBuscado); 
            setAluno(alunoBuscado); 
          }
        } catch (err: any) {
          console.error("Erro ao buscar aluno:", err);
          setError(err.message || "Ocorreu um erro desconhecido ao carregar os dados.");
          setAluno(null);
        } finally {
          setIsLoading(false); 
        }
      }
      const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const transactionsData = await getExtrato();
          console.log("Transações buscadas:", transactionsData); 
          setTransactions(transactionsData.transacoes);
        } catch (err: any) {
          console.error("Erro ao buscar transações:", err);
          setError(err.message || "Ocorreu um erro desconhecido ao carregar as transações.");
      }
    }
      fetchTransactions();
      fetchAluno()
    }, []) 
  const filteredTransactions = transactions.filter((transaction => {
    if (filter === "all") return true;
    if (filter === "receive") return transaction.professor_id !== null;
    if (filter === "redeem") return transaction.professor_id === null;
    return false;
  }));


  const totalReceived = transactions.filter((t) => t.valor && t.valor > 0).reduce((sum, t) => sum + (t.valor || 0), 0)

  const totalRedeemed = transactions.filter((t) => t.valor && t.valor < 0).reduce((sum, t) => sum + (t.valor || 0), 0) * -1

  return (
  <DashboardLayout userType="student" userName={aluno?.nome ?? 'Aluno'} balance={aluno?.saldo_moedas ?? 0}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Extrato de Transações</h1>
          <p className="text-gray-500">Acompanhe todas as suas movimentações</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-gray-500 mb-1">Saldo Atual</p>
            <p className="text-3xl font-bold text-primary">{aluno?.saldo_moedas ?? 0}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-gray-500 mb-1">Total Recebido</p>
            <p className="text-3xl font-bold text-success">+{totalReceived}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border">
            <p className="text-sm text-gray-500 mb-1">Total Resgatado</p>
            <p className="text-3xl font-bold text-error">{totalRedeemed}</p>
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
              Todas
            </button>
            <button
              onClick={() => setFilter("receive")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "receive" ? "bg-success text-white" : "bg-surface text-gray-500 hover:bg-border"
              }`}
            >
              Recebidas
            </button>
            <button
              onClick={() => setFilter("redeem")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "redeem" ? "bg-error text-white" : "bg-surface text-gray-500 hover:bg-border"
              }`}
            >
              Resgatadas
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl border border-border divide-y divide-border">
          {filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} userType="student" />
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
