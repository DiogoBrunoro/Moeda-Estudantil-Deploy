"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import TextField from "@/components/text-field"
import Button from "@/components/button"
import { useRouter } from "next/navigation"
import apiUrl from "@/api/apiUrl"
import { useSearchParams } from "next/navigation";
import {useNotification} from "@/context/NotificationContext";

export default function EditAdvantagePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const { showNotification } = useNotification();
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState<any>(null)
  const [loadingData, setLoadingData] = useState(true)

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    custo_moedas: "",
    foto_url: "",
    quantidade: "",
  })

  useEffect(() => {
    if (!id) {
      console.log("Cheguei")
      return
    }
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          showNotification("Token não encontrado. Faça login novamente.", "error");
          router.push("/login")
          return
        }

        const perfilRes = await fetch(`${apiUrl}/empresa/perfil`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!perfilRes.ok) throw new Error("Erro ao buscar perfil")
        const perfilData = await perfilRes.json()
        setCompany(perfilData)

        const vantRes = await fetch(`${apiUrl}/empresa/vantagens/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!vantRes.ok) throw new Error("Erro ao buscar vantagem")
        const vant = await vantRes.json()

        setFormData({
          titulo: vant.titulo ?? "",
          descricao: vant.descricao ?? "",
          custo_moedas: String(vant.custoMoedas ?? vant.custo_moedas ?? ""),
          foto_url: vant.fotoURL ?? vant.foto_url ?? "",
          quantidade: String(vant.quantidade ?? ""),
        })
      } catch (err) {
        console.error("❌ Erro ao carregar dados:", err)
        showNotification("Erro ao carregar dados da vantagem.", "error");
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [id, router])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        showNotification("Token não encontrado. Faça login novamente.", "error");
        router.push("/login")
        return
      }

      const payload = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        foto_url: formData.foto_url,
        custo_moedas: parseInt(formData.custo_moedas),
        quantidade: parseInt(formData.quantidade),
      }

      if (isNaN(payload.custo_moedas) || isNaN(payload.quantidade)) {
        throw new Error("Custo em moedas e Quantidade devem ser números válidos.")
      }

      const response = await fetch(`${apiUrl}/empresa/vantagens/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Erro ao atualizar vantagem")

      showNotification("Vantagem atualizada com sucesso!", "success");
      router.push("/company/advantages")
    } catch (err) {
      console.error("❌ Erro ao atualizar:", err)
      showNotification(`Erro ao atualizar vantagem. ${err instanceof Error ? err.message : "Verifique os campos."}`, "error");
    } finally {
      setLoading(false)
    }
  }

  console.log("Company data:", company)
  console.log("Form data:", loadingData)
  if (loadingData || !company) {
    return (
      <DashboardLayout userType="company" userName="Carregando...">
        <div className="text-center mt-20 text-gray-500">Carregando informações...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType="company" userName={company.nome || "Empresa"}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Vantagem</h1>
          <p className="text-gray-600">Atualize os dados da vantagem</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm space-y-6">
          <TextField label="Título da vantagem" value={formData.titulo} onChange={(v) => updateField("titulo", v)} required />

          <TextField
            label="Descrição"
            value={formData.descricao}
            onChange={(v) => updateField("descricao", v)}
            multiline
            rows={4}
            required
          />

          <div className="flex flex-col sm:flex-row gap-6">
            <TextField label="Custo em moedas" type="number" value={formData.custo_moedas} onChange={(v) => updateField("custo_moedas", v)} required />
            <TextField label="Quantidade Disponível (Estoque)" type="number" value={formData.quantidade} onChange={(v) => updateField("quantidade", v)} placeholder="Ex: 50" required />
          </div>

          <TextField label="URL da imagem" value={formData.foto_url} onChange={(v) => updateField("foto_url", v)} required />

          {formData.foto_url && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={formData.foto_url}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://placehold.co/600x200/e2e8f0/94a3b8?text=Imagem+Invalida"
                }}
              />
            </div>
          )}

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/company/advantages")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
