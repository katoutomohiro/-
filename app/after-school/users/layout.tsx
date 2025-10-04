import type React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "放課後等デイサービス - 利用者一覧 | PROJECT SOUL",
  description: "放課後等デイサービスの利用者管理",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
}

export default function AfterSchoolUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
