import type { Transaction } from "@/types"

interface TransactionItemProps {
  transaction: Transaction
  userType?: "professor" | "student"
}

export default function TransactionItem({ transaction, userType }: TransactionItemProps) {
  let isPositive = false
  let isNegative = false

  if (userType === "professor") {
  if (transaction.aluno_id) {
     isNegative = true
  } else if (!transaction.aluno_id) {
     isPositive = true
  }
  } else if (userType === "student") {
    if (transaction.professor_id) {
      isPositive = true
    } else if (!transaction.professor_id) {
      isNegative = true
    }
  }
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPositive ? "bg-green-100" : isNegative ? "bg-red-100" : "bg-gray-200"
          }`}
        >
          {isPositive ? (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          ) : isNegative ? (
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          )}
        </div>

        <div>
          <p className="font-medium text-gray-800">{transaction.motivo}</p>
          <p className="text-sm text-gray-500">{transaction.data}</p>

          {transaction.professor?.nome && (
            <p className="text-xs text-gray-400">De: {transaction.professor?.nome}</p>
          )}
          {transaction.aluno?.nome && (
            <p className="text-xs text-gray-400">Para: {transaction.aluno?.nome}</p>
          )}
        </div>
      </div>

      <div
        className={`font-semibold ${
          isPositive ? "text-green-600" : isNegative ? "text-red-500" : "text-gray-600"
        }`}
        >
          {transaction.valor! > 0 && isPositive ? "+" : isNegative ? "-" : ""}
        {transaction.valor}
      </div>
    </div>
  )
}
