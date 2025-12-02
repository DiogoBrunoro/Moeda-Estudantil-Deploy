"use client"

interface SelectFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  required?: boolean
  error?: string
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
}: SelectFieldProps) {
  return (
    <div className="">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-error" : "border-border"
        } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </div>
  )
}
