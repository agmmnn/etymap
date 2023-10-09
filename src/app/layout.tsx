import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "mapbox-gl/dist/mapbox-gl.css"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: "EtyMap - Interactive Etymology Map",
  description:
    "Explore the fascinating world of etymology with EtyMap, an interactive map of word origins and history. Explore the vast network of linguistic connections across languages and cultures, exploring the rich tapestry of word origins. Take EtyMap to the roots of language and reveal the stories behind the words we use every day.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: ["Etymology", "Map"],
  authors: [
    {
      name: "agmmnn",
      url: "https://agmmnn.dev",
    },
  ],
  creator: "agmmnn",
}
