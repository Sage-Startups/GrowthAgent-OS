import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Staffgent | Hire Your AI Workforce",
    template: "%s | Staffgent",
  },
  description:
    "Build a specialised AI workforce for your business. Hire AI employees for sales, marketing, branding, operations and finance — configured around the way your business works.",
  keywords: ["AI workforce", "AI employees", "AI team", "business AI", "sales", "marketing", "operations"],
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
