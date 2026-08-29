import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Fenntrace — Personal Data Exposure Checker",
  description:
    "Understand your exposure without turning your email into a profile. Check if your email appears in known data breaches.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("dark antialiased", inter.variable, jetbrainsMono.variable)}
    >
      <body>{children}</body>
    </html>
  )
}
