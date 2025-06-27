import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { SolanaProviders } from "@/components/solana-wallet-provider" // Updated import
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StratoLend Network - Cross-Chain Lending Reimagined",
  description:
    "Deposit collateral on one chain, borrow on another. Maximize your capital efficiency across blockchain ecosystems.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaProviders> {/* Updated Provider */}
          <Navigation />
          <main>{children}</main>
          <Toaster />
        </SolanaProviders>
      </body>
    </html>
  )
}
