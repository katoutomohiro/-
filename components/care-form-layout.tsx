"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

type CareFormLayoutProps = {
  title: string
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  children: React.ReactNode
  isSubmitting?: boolean
  className?: string
  "data-build"?: string
}

export function CareFormLayout({
  title,
  onSubmit,
  onCancel,
  children,
  isSubmitting = false,
  className = "",
  "data-build": dataBuild,
}: CareFormLayoutProps) {
  return (
    <form onSubmit={onSubmit} className="h-full flex flex-col" data-build={dataBuild}>
      <div className="flex flex-col h-full w-full">
        {/* ヘッダー - 固定 */}
        <div className="shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* コンテンツ - スクロール可能 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">{children}</div>

        {/* フッター - 固定 */}
        <div className="shrink-0 border-t bg-white/95 backdrop-blur-sm px-6 py-4 flex gap-3 justify-end shadow-lg">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 bg-transparent"
          >
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CareFormLayout
