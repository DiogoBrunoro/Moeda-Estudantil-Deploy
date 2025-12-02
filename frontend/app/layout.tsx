import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/context/NotificationContext"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata = {
  title: "Sistema de Mérito Estudantil",
  description: "Plataforma de reconhecimento estudantil com moeda virtual",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="test-bg-gradient">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  )
}
