"use client"

interface TextFieldProps {
  label: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  className?: string
  multiline?: boolean
  rows?: number
  readOnly?: boolean
}

export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = "",
  multiline = false,
  rows = 3,
  readOnly = false,
}: TextFieldProps) {
  // estilo condicional
  const baseStyle = `
    flex w-full rounded-lg border border-input px-4 py-2 text-base ring-offset-background 
    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors
  `

  // quando estiver travado, mostra cinza + cursor bloqueado
  const stateStyle = readOnly
    ? "bg-gray-100 text-gray-600 cursor-not-allowed"
    : "bg-white text-gray-900"

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium leading-none">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          className={`${baseStyle} ${stateStyle} ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={`${baseStyle} ${stateStyle} h-11 ${
            error ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
