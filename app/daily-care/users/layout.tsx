import type React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "生活介護 - 利用者一覧 | PROJECT SOUL",
  description: "生活介護サービスの利用者管理",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#3b82f6",
}

export default function DailyCareUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
