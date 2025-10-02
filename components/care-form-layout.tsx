'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface CareFormLayoutProps {
  title: string
  icon: ReactNode
  children: ReactNode
  onSave: () => void
  onCancel: () => void
  isSaving?: boolean
}

export function CareFormLayout({
  title,
  icon,
  children,
  onSave,
  onCancel,
  isSaving = false,
}: CareFormLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      {/* ヘッダー（固定） */}
      <div className="flex-shrink-0 border-b bg-background px-6 py-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      </div>

      {/* コンテンツ（スクロール可能） */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {children}
      </div>

      {/* フッター（固定） */}
      <div className="flex-shrink-0 border-t bg-background px-6 py-4">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isSaving}>
            キャンセル
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CareFormLayout
