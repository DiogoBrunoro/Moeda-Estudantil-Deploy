"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import { Student, type Advantage } from "@/types"

// ALTERADO: Importe a nova função e o novo tipo
import { getAlunoData, resgatarVantagem, getVantagensParaAluno, type AdvantageWithStatus } from "@/api/alunoApi"
import LoadingSpinner from "@/components/loading-spinner"

export default function StudentAdvantagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [aluno, setAluno] = useState<Student | null>(null)
  
  // ALTERADO: O estado agora armazena o DTO completo
  const [advantages, setAdvantages] = useState<AdvantageWithStatus[]>([]) 
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)

  // 🔹 Buscar dados do aluno (sem mudanças)
  useEffect(() => {
    const fetchAluno = async () => {
      try {
        const alunoBuscado = await getAlunoData()
        setAluno(alunoBuscado)
      } catch (err: unknown) {
        console.error("Erro ao buscar aluno:", err)
        setAluno(null)
      }
    }
    fetchAluno()
  }, [])

  // 🔹 ALTERADO: Buscar vantagens da rota autenticada
  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        // Usa a nova função da API
        const data = await getVantagensParaAluno()
        setAdvantages(data) // Os dados já vêm mapeados da API
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message) // ✅ seguro
        } else {
          setError("Erro desconhecido") // fallback
        }
      }
      
    }

    fetchAdvantages()
  }, [])

  // 🔎 ALTERADO: Filtro de busca agora olha dentro de 'vantagem'
  const filteredAdvantages = advantages.filter((advantageWithStatus) => {
    const advantage = advantageWithStatus.vantagem // Pega o objeto vantagem
    const matchesSearch =
      advantage.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      advantage.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // 🎁 Resgatar vantagem
  const handleRedeem = async (advantage: Advantage) => {
    if (redeemingId) return
    if (!aluno) {
      alert("Erro: Dados do aluno não carregados. Tente recarregar a página.")
      return
    }

    // Validação de resgate duplicado (extra)
    const advStatus = advantages.find(a => a.vantagem.id === advantage.id)
    if (advStatus?.ja_resgatada) {
       alert("Você já resgatou esta vantagem.")
       return
    }

    if (aluno.saldo_moedas < advantage.cost) {
      alert("Saldo insuficiente para resgatar esta vantagem.")
      return
    }

    const confirmed = confirm(
      `Você tem certeza que quer resgatar "${advantage.title}" por ${advantage.cost} moedas?`,
    )
    if (!confirmed) return

    setRedeemingId(advantage.id)

    try {
      await resgatarVantagem(advantage.id)

      setAluno(prevAluno => {
        if (!prevAluno) return null
        return {
          ...prevAluno,
          saldo_moedas: prevAluno.saldo_moedas - advantage.cost
        }
      })

      alert(
        `Vantagem "${advantage.title}" resgatada com sucesso!\n\nUm email com o cupom será enviado para você!`,
      )

      // ALTERADO: Atualiza o estado local para marcar como resgatada
      setAdvantages(prevAdvantages =>
        prevAdvantages.map(advWithStatus =>
          advWithStatus.vantagem.id === advantage.id
            ? { 
                ...advWithStatus, 
                ja_resgatada: true, // Marca como resgatada
                vantagem: { 
                  ...advWithStatus.vantagem, 
                  quantidade: advWithStatus.vantagem.quantidade - 1 // Decrementa a quantidade
                } 
              }
            : advWithStatus
        )
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message) // ✅ seguro
      } else {
        setError("Erro desconhecido") // fallback
      }
    }
  }

  if (!aluno) return <LoadingSpinner />

  return (
    <DashboardLayout userType="student" userName={aluno.nome} balance={aluno.saldo_moedas}>
      <div className="space-y-6">
        {/* ... (Header e Filtros não mudam) ... */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vantagens Disponíveis</h1>
          <p className="text-gray-500">Resgate vantagens incríveis com suas moedas</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar vantagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="all">Todas as categorias</option>
              <option value="food">Alimentação</option>
              <option value="education">Educação</option>
              <option value="tech">Tecnologia</option>
              <option value="entertainment">Entretenimento</option>
            </select>
          </div>
        </div>

        {/* ... (Loading & Errors não mudam) ... */}
        {loading && <p className="text-center text-muted">Carregando vantagens...</p>}
        {error && <p className="text-center text-red-500">Erro: {error}</p>}


        {/* ALTERADO: Grid de Vantagens agora usa o DTO */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdvantages.map((advantageWithStatus) => (
              <AdvantageCard
                key={advantageWithStatus.vantagem.id}
                advantage={advantageWithStatus.vantagem} // Passa o objeto 'vantagem'
                
                // Passa a função de resgate corretamente
                onRedeem={() => handleRedeem(advantageWithStatus.vantagem)} 
                
                userBalance={aluno.saldo_moedas}
                isLoading={redeemingId === advantageWithStatus.vantagem.id}
                
                // NOVO: Passa o status de resgate para o card
                isRedeemed={advantageWithStatus.ja_resgatada} 
              />
            ))}
          </div>
        )}

        {/* ... (Mensagem de 'Nenhuma vantagem' não muda) ... */}
         {!loading && filteredAdvantages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">Nenhuma vantagem encontrada</p>
          </div>
         )}
      </div>
    </DashboardLayout>
  )
}