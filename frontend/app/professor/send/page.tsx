"use client"

import type React from "react"
import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import StudentSearch from "@/components/student-search"
import { useRouter } from "next/navigation"
import type { Transaction, Student } from "@/types"
import apiUrl from "../../../api/apiUrl";

interface Professor {
  nome: string
  saldo_moedas: number
}

export default function ProfessorSendPage() {
  const router = useRouter()
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Partial<Student> | undefined>()
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Pega o perfil do professor para mostrar saldo
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token não encontrado")

        const res = await fetch(`${apiUrl}/professor/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Erro ao buscar perfil")
        }

        const data = await res.json()
        setProfessor(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || "Erro ao carregar dados do professor")
      }
    }

    fetchPerfil()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!professor) {
      setError("Perfil do professor não carregado")
      return
    }

    if (!selectedStudent) {
      setError("Selecione um aluno")
      return
    }

    const amountNum = Number.parseInt(amount)
    if (!amountNum || amountNum <= 0) {
      setError("Digite um valor válido")
      return
    }

    if (amountNum > professor.saldo_moedas) {
      setError("Saldo insuficiente")
      return
    }

    if (!reason.trim()) {
      setError("O motivo é obrigatório")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      console.log("Token:", token)
      if (!token) throw new Error("Token não encontrado")
  console.log("Enviando aluno:", selectedStudent?.id)

      const res = await fetch(`${apiUrl}/professor/enviar-moedas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          aluno_id: Number(selectedStudent?.id),
          valor: amountNum,
          motivo: reason,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Erro ao enviar moedas")
      }

      const data: Transaction = await res.json()

      // Atualiza saldo local
      setProfessor({ ...professor, saldo_moedas: professor.saldo_moedas - amountNum })
      setSelectedStudent(undefined)
      setAmount("")
      setReason("")
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Erro ao enviar moedas")
    } finally {
      setLoading(false)
    }
  }

  if (!professor) {
    return (
      <DashboardLayout userType="professor" userName="Carregando...">
        <div className="text-center mt-10">Carregando dados do professor...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="professor" userName={professor.nome} balance={professor.saldo_moedas}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Enviar Moedas</h1>
          <p className="text-gray-500">Reconheça o mérito dos seus alunos</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-6 text-white">
          <p className="text-white/80 text-sm mb-1">Seu saldo disponível</p>
          <p className="text-4xl font-bold">{professor.saldo_moedas}</p>
          <p className="text-white/80 text-sm mt-2">moedas</p>
        </div>

        {/* Send Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-border space-y-6">
          <StudentSearch onSelect={(s) => setSelectedStudent(s)} selectedStudent={selectedStudent} />

          <TextField
            label="Quantidade de moedas"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Ex: 100"
            required
          />

          <TextField
            label="Motivo do reconhecimento"
            value={reason}
            onChange={setReason}
            placeholder="Ex: Excelente participação em aula e trabalho bem elaborado"
            multiline
            rows={4}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/professor/dashboard")} >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} >
              {loading ? "Enviando..." : "Enviar Moedas"}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Dicas para reconhecimento</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Seja específico no motivo do reconhecimento</li>
                <li>Reconheça comportamentos que deseja incentivar</li>
                <li>O aluno receberá um email com sua mensagem</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
