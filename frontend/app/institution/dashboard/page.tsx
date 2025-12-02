"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import StatCard from "@/components/stat-card"
import Button from "@/components/button"
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

interface Professor {
  id: number
  nome: string
  email: string
  departamento: string
  createdAt: string
}

interface Instituicao {
  id: number
  nome: string
  cnpj: string
  endereco: string
}

// Função para buscar perfil da instituição
async function getInstituicaoData(): Promise<Instituicao> {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Token não encontrado")

  const res = await fetch(`${apiUrl}/instituicao/perfil`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Erro ao buscar perfil da instituição")
  }

  return res.json()
}

export default function InstituicaoDashboard() {
  const router = useRouter()
  const [institution, setInstitution] = useState<Instituicao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [recentProfessors, setRecentProfessors] = useState<Professor[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Busca dados da instituição
        const data = await getInstituicaoData()
        setInstitution(data)
        localStorage.setItem("instituicao", JSON.stringify(data))

        // (Opcional) buscar professores recentes da instituição
        const token = localStorage.getItem("token")
        const profRes = await fetch(`${apiUrl}/professores/recentes`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (profRes.ok) {
          const profs = await profRes.json()
          setRecentProfessors(profs)
        }
      } catch (err: any) {
        console.error("Erro ao carregar dados:", err)
        setError(err.message || "Erro ao carregar dados")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Carregando...">
        <div className="text-center text-gray-600 mt-10">Carregando dados da instituição...</div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout userType="admin" userName="Erro">
        <div className="text-center text-red-600 mt-10">{error}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="admin" userName={institution?.nome || "Instituição de Ensino"}>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Bem-vindo, {institution?.nome || "Instituição"}!</h1>
          <p className="text-purple-100 text-lg">
            Gerencie seus professores e acompanhe o desempenho da sua instituição
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total de Professores" value={recentProfessors.length || 0} icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          } />

          <StatCard title="Departamentos Ativos" value={8} icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          } />

          <StatCard title="Alunos Cadastrados" value={1250} icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          } />
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-3">Cadastre novos professores</h2>
              <p className="text-green-50 text-lg leading-relaxed">
                Adicione professores à sua instituição e gerencie o corpo docente
              </p>
            </div>
            <Button variant="secondary" onClick={() => router.push("/institution/registerProfessor")}>
              <div className="flex items-center gap-2 px-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Cadastrar Professor
              </div>
            </Button>
          </div>
        </div>

        {/* Professores Recentes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Professores Cadastrados Recentemente</h2>
            <a href="/instituicao/professores" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
              Ver todos os professores →
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
            {recentProfessors.length > 0 ? (
              recentProfessors.map((professor) => (
                <div key={professor.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{professor.nome}</h3>
                        <p className="text-sm text-gray-600">{professor.email}</p>
                        <p className="text-sm text-gray-500 mt-1">{professor.departamento}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Cadastrado em</p>
                      <p className="text-sm font-medium text-gray-900">{professor.createdAt}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">Nenhum professor recente encontrado.</div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-purple-900 mb-2">Sobre o gerenciamento</h3>
              <p className="text-purple-800 leading-relaxed">
                Cada professor cadastrado recebe 1.000 moedas por semestre para distribuir aos alunos. Você pode
                acompanhar todas as atividades através do painel de controle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
