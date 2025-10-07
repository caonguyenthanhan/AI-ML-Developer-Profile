import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Thiệp Mời Tốt Nghiệp 2025",
  description: "Thiệp mời tham dự lễ tốt nghiệp",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="antialiased">{children}</body>
    </html>
  )
}
