"use client"

import type React from "react"
import type { ReactNode } from "react"
import Button from "@/components/button"
import Link from "next/link"

interface AuthFormProps {
  children: ReactNode
  onSubmit: (e: React.FormEvent) => void
  loading?: boolean
  buttonText: string
  forgotPasswordLink?: string
  registerLink?: string
}

export default function AuthForm({
  children,
  onSubmit,
  loading = false,
  buttonText,
  forgotPasswordLink = "/forgot-password",
  registerLink = "/register",
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="w-full space-y-8">
      {children}

      <div className="flex items-center justify-between mt-4 mb-8">
        <label className="flex items-center text-base text-gray-700 hover:text-gray-900 cursor-pointer">
          <input type="checkbox" className="mr-2 h-5 w-5 accent-primary" />
          Lembrar de mim
        </label>

        <Link
          href={forgotPasswordLink}
          className="text-base text-primary font-medium hover:underline hover:text-primary-dark"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full text-white" loading={loading}>
        {buttonText}
      </Button>

      <div className="mt-8 text-center">
        <p className="text-base text-gray-500">
          Não tem uma conta?{" "}
          <Link href={registerLink} className="text-primary font-medium hover:underline hover:text-primary-dark">
            Cadastre-se
          </Link>
        </p>
      </div>
    </form>
  )
}
