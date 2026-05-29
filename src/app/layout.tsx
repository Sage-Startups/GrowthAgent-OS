import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "GrowthAgent OS — AI Agents for Sales Growth",
    template: "%s | GrowthAgent OS",
  },
  description:
    "AI agents that turn enquiries into qualified sales opportunities. GrowthAgent OS gives your digital business a private AI sales operator.",
  keywords: ["AI agents", "sales automation", "lead management", "CRM", "SaaS"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
