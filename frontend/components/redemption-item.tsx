"use client"

import type { Redemption } from "@/types"

interface RedemptionItemProps {
  redemption: Redemption
  onComplete?: (redemption: Redemption) => void
}

export default function RedemptionItem({ redemption, onComplete }: RedemptionItemProps) {
  const statusColors = {
    pending: "bg-warning/10 text-warning",
    completed: "bg-success/10 text-success",
    cancelled: "bg-error/10 text-error",
  }

  const statusLabels = {
    pending: "Pendente",
    completed: "Concluído",
    cancelled: "Cancelado",
  }

  return (
    <div className="flex items-center justify-between p-4 hover:bg-surface rounded-lg transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold text-foreground">{redemption.advantageTitle}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[redemption.status]}`}>
            {statusLabels[redemption.status]}
          </span>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Aluno:</span> {redemption.studentName}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Email:</span> {redemption.studentEmail}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Data:</span> {redemption.date}
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Código:</span>{" "}
            <span className="font-mono bg-surface px-2 py-1 rounded">{redemption.code}</span>
          </p>
        </div>
      </div>

      {redemption.status === "pending" && onComplete && (
        <button
          onClick={() => onComplete(redemption)}
          className="ml-4 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium"
        >
          Confirmar
        </button>
      )}
    </div>
  )
}
