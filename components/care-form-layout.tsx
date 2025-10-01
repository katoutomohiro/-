"use client"

import type React from "react"

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type CareFormLayoutProps = {
  title: string
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
  children: React.ReactNode
  isSubmitting?: boolean
}

export function CareFormLayout({ title, onSubmit, onCancel, children, isSubmitting = false }: CareFormLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Card className="flex flex-col h-full w-full">
        <CardHeader className="shrink-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        </CardHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto space-y-6 p-6 pb-24 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {children}
          </CardContent>

          <CardFooter className="sticky bottom-0 shrink-0 border-t bg-white/95 backdrop-blur-sm p-4 flex gap-3 justify-end shadow-lg z-10">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 bg-transparent"
            >
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 bg-green-600 hover:bg-green-700"
              onClick={onSubmit}
            >
              {isSubmitting ? "保存中..." : "記録を保存"}
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  )
}

export default CareFormLayout
