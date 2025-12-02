import type React from "react"
import clsx from "clsx"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
  }
  subtitle?: string // <--- Subtitle agora é opcional
  color?: string
}

export default function StatCard({ title, value, icon, trend, subtitle, color }: StatCardProps) {
  const iconBackgroundClasses = clsx(
    "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg",
    !color && "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30"
  );

  const iconStyle = color
    ? { backgroundColor: color, boxShadow: `0 10px 15px -3px ${color}30, 0 4px 6px -4px ${color}30` }
    : {};

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && ( 
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}

          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <svg
                className={clsx("w-4 h-4", trend.positive ? "text-green-600" : "text-red-600")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={trend.positive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
                />
              </svg>
              <span className={clsx("text-sm font-medium", trend.positive ? "text-green-600" : "text-red-600")}>
                {trend.value}
              </span>
            </div>
          )}
        </div>

        <div
          className={iconBackgroundClasses}
          style={iconStyle}
        >
          <div className="text-white">{icon}</div>
        </div>
      </div>
    </div>
  )
}