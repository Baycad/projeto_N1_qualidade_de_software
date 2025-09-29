import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { V0Provider } from "@/lib/context"
import dynamic from "next/dynamic"

const V0Setup = dynamic(() => import("@/components/v0-setup"))

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Gestão de Finanças",
  description: "Organize seus gastos facilmente",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className={cn(interSans.variable, robotoMono.variable)}>
        <V0Provider>
          <V0Setup />
          {children}
        </V0Provider>
      </body>
    </html>
  )
}
