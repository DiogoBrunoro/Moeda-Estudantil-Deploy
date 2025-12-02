"use client";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth-layout";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Escolha o tipo de conta que deseja criar"
    >
      <div className="space-y-4">
        <button
          onClick={() => router.push("/register/student")}
          className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-surface transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="flex-1 cursor-pointer">
              <h3 className="font-semibold text-lg text-foreground mb-1">Sou Aluno</h3>
              <p className="text-sm text-gray-500">Receba moedas por mérito e troque por vantagens</p>
            </div>
          </div>
        </button>

        {/* === Bloco Modificado === */}
        <button
          onClick={() => router.push("/register/institution")}
          className="w-full p-6 border-2 border-border rounded-xl hover:border-orange-500 hover:bg-surface transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                />
              </svg>
            </div>
            <div className="flex-1 cursor-pointer">
              <h3 className="font-semibold text-lg text-foreground mb-1">Sou Instituição</h3>
              <p className="text-sm text-gray-500">Cadastre sua instituição de ensino</p>
            </div>
          </div>
        </button>
        {/* === Fim do Bloco Modificado === */}

        <button
          onClick={() => router.push("/register/company")}
          className="w-full p-6 border-2 border-border rounded-xl hover:border-secondary hover:bg-surface transition-all text-left group"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
              <svg
                className="w-6 h-6 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="flex-1 cursor-pointer">
              <h3 className="font-semibold text-lg text-foreground mb-1">Sou Empresa Parceira</h3>
              <p className="text-sm text-gray-500">Ofereça vantagens e atraia estudantes</p>
            </div>
          </div>
        </button>

        <div className="mt-6 text-center">
          <p className="text-base text-gray-500">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}