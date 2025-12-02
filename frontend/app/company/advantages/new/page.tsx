"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import apiUrl from "../../../../api/apiUrl";




export default function NewAdvantagePage() {
  const router = useRouter() 
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<any>(null)

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    custo_moedas: "",
    foto_url: "",
    quantidade_disponivel: "", 
  })

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          alert("Token não encontrado. Faça login novamente.")
          router.push("/login")
          return
        }

        const response = await fetch(`${apiUrl}/empresa/perfil`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Erro ao buscar dados da empresa")

        const data = await response.json()
        setCompany(data)
      } catch (err) {
        console.error("❌ Erro ao buscar empresa:", err)
      }
    }

    fetchCompany()
  }, [router])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Token não encontrado. Faça login novamente.")
        router.push("/login")
        return
      }

      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        foto_url: formData.foto_url,
        custo_moedas: parseInt(formData.custo_moedas),
        quantidade: parseInt(formData.quantidade_disponivel), 
      }

      if (isNaN(payload.custo_moedas) || isNaN(payload.quantidade)) {
        throw new Error("Custo em moedas e Quantidade devem ser números válidos.")
      }

      const response = await fetch(`${apiUrl}/empresa/vantagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao cadastrar vantagem")
      }

      alert("✅ Vantagem cadastrada com sucesso!")
      router.push("/company/advantages")
    } catch (err) {
      console.error("❌ Erro ao cadastrar vantagem:", err)
      alert(`Erro ao cadastrar vantagem. ${err instanceof Error ? err.message : "Verifique os campos e tente novamente."}`)
    } finally {
      setLoading(false)
    }
  }

  if (!company) {
    return (
      <DashboardLayout userType="company" userName="Carregando...">
        <div className="text-center mt-20 text-gray-500">
          Carregando informações da empresa...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="company" userName={company?.nome || "Empresa"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Vantagem</h1>
          <p className="text-gray-600">
            Cadastre uma nova vantagem para os estudantes
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm space-y-6"
        >
          <TextField
            label="Título da vantagem"
            value={formData.titulo}
            onChange={(v) => updateField("titulo", v)}
            placeholder="Ex: 20% de desconto em produtos"
            required
          />

          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={(v) => updateField("descricao", v)}
            placeholder="Descreva os detalhes da vantagem..."
            multiline
            rows={4}
            required
          />

          <div className="flex flex-col sm:flex-row gap-6">
            <TextField
              label="Custo em moedas"
              type="number"
              value={formData.custo_moedas}
              onChange={(v) => updateField("custo_moedas", v)}
              placeholder="Ex: 300"
              required
            />

            {/* 🔹 CAMPO ADICIONADO AO FORMULÁRIO 🔹 */}
            <TextField
              label="Quantidade Disponível (Estoque)"
              type="number"
              value={formData.quantidade_disponivel}
              onChange={(v) => updateField("quantidade_disponivel", v)}
              placeholder="Ex: 50"
              required
            />
          </div>

          <TextField
            label="URL da imagem"
            value={formData.foto_url}
            onChange={(v) => updateField("foto_url", v)}
            placeholder="https://exemplo.com/imagem.jpg"
            required
          />

          {formData.foto_url && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={formData.foto_url}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  // Adiciona um placeholder em caso de erro na URL
                  const target = e.target as HTMLImageElement
                  target.src = "https://placehold.co/600x200/e2e8f0/94a3b8?text=Imagem+Invalida"
                }}
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800">
                  Quando um aluno resgatar esta vantagem, você receberá um email
                  com o código de confirmação e os dados do aluno.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/company/advantages")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Vantagem"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}