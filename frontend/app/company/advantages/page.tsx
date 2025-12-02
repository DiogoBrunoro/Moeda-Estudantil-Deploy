"use client"

import { useEffect, useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import AdvantageCard from "@/components/advantage-card"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import { Advantage } from "@/types"
import { useNotification } from "@/context/NotificationContext"
import apiUrl from "../../../api/apiUrl";


export default function CompanyAdvantagesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [advantages, setAdvantages] = useState<Advantage[]>([])
  const [companyName, setCompanyName] = useState("Carregando...")
  const [loading, setLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          showNotification("Token não encontrado. Faça login novamente", "warning");
          router.push("/login")
          return
        }

        // Buscar empresa
        const perfilRes = await fetch(`${apiUrl}/empresa/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!perfilRes.ok) throw new Error("Erro ao buscar perfil da empresa")
        const perfilData = await perfilRes.json()
        setCompanyName(perfilData.nome)

        // Buscar vantagens
        const res = await fetch(`${apiUrl}/empresa/vantagens`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Erro ao buscar vantagens")

        const data = await res.json()
        console.log("Vantagens buscadas:", data)

        // ✅ Converter retorno do backend
        const formatted: Advantage[] = data.map((v: any) => ({
          id: String(v.ID),
          companyId: String(v.empresa_parceira_id),
          companyName: v.empresa_parceira?.nome || "Empresa Parceira",
          title: v.titulo,
          description: v.descricao,
          cost: Number(v.custo_moedas),
          imageUrl: v.foto_url || "/default.png",
          quantidade: Number(v.quantidade),
          estoque: Number(v.estoque),
        }))

        setAdvantages(formatted)
      } catch (err) {
        console.error("Erro ao buscar vantagens:", err)
        showNotification("Erro ao carregar vantagem", "error");
      } finally {
        setLoading(false)
      }
    }

    fetchAdvantages()
  }, [router])

  const filteredAdvantages = advantages.filter((adv) =>
    adv.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardLayout userType="company" userName="Carregando...">
        <div className="text-center py-20 text-gray-500">Carregando vantagens...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="company" userName={companyName}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Minhas Vantagens</h1>
            <p className="text-gray-500">Gerencie as vantagens oferecidas aos estudantes</p>
          </div>

          <Button onClick={() => router.push("/company/advantages/new")}>
            <div className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Vantagem
            </div>
          </Button>
        </div>

        {/* Campo de busca */}
        <div className="bg-white rounded-xl p-6 border border-border">
          <input
            type="text"
            placeholder="Buscar vantagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Lista de vantagens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdvantages.length > 0 ? (
            filteredAdvantages.map((adv) => (
              <AdvantageCard
                key={adv.id} // ✅ Agora existe e é único
                advantage={{
                  id: adv.id.toString(),
                  companyId: "",
                  companyName,
                  title: adv.title,
                  description: adv.description,
                  cost: adv.cost,
                  imageUrl: adv.imageUrl || "/placeholder.svg",
                  quantidade: adv.quantidade,
                  estoque: adv.estoque,
                  empresa_parceira: { nome: companyName },
                }}
                onEdit={() => router.push(`/company/advantages/edit?id=${adv.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Nenhuma vantagem encontrada
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
