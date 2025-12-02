"use client"

import type { Advantage } from "@/types"
import Button from "./button"
import IconButton from "@mui/material/IconButton"
import EditIcon from "@mui/icons-material/Edit"
import { useRouter } from "next/navigation"

interface AdvantageCardProps {
  advantage: Advantage
  onRedeem?: (advantage: Advantage) => void
  userBalance?: number
  isLoading?: boolean
  onEdit?: (advantage: Advantage) => void
  isRedeemed?: boolean 
}

export default function AdvantageCard({
  advantage,
  onRedeem,
  userBalance,
  onEdit,
  isLoading = false,
  isRedeemed = false, 
}: AdvantageCardProps) {
  const canAfford = userBalance !== undefined && userBalance >= advantage.cost
  const router = useRouter()

  const isDisabled =
    isLoading || isRedeemed || advantage.quantidade === 0 || !canAfford

  const getButtonText = () => {
    if (isLoading) return "Resgatando..."
    if (isRedeemed) return "Já Resgatado"
    if (advantage.quantidade === 0) return "Esgotado"
    if (canAfford) return "Resgatar Vantagem"
    return "Saldo Insuficiente"
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative">
      
      {isRedeemed && (
        <>
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold z-20 shadow-lg">
            RESGATADO
          </div>
          <div className="absolute inset-0 bg-white/50 z-10" />
        </>
      )}

      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {onEdit && (
          <IconButton
            onClick={() => onEdit?.(advantage)}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8, 
              bgcolor: "white",
              zIndex: 30, 
              "&:hover": { bgcolor: "#e5e7eb" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}

        <img
          src={advantage.imageUrl || advantage.foto_url ||  "/placeholder.svg"}
          alt={advantage.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg z-20">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg>
          {advantage.cost ?? advantage.custo_moedas}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 mb-2 truncate">
              {advantage.title || advantage.titulo }
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {advantage.quantidade}/{advantage.estoque}
            </p>
          </div>
          <p className="text-sm font-medium text-blue-600 truncate">
            {advantage.companyName ?? advantage.empresa_parceira.nome!}
          </p>
        </div>

        <p className="text-sm text-gray-600 mb-6 line-clamp-2 min-h-[2.5rem]">
          {advantage.description ?? advantage.descricao}
        </p>

        {onRedeem && (
          <Button
            onClick={() => onRedeem(advantage)}
            disabled={isDisabled} 
            variant={!isDisabled ? "primary" : "outline"}
            className="flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {getButtonText()}
          </Button>
        )}
      </div>
    </div>
  )
}