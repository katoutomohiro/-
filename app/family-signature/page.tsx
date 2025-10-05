"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import FamilySignatureForm from "@/components/family-signature-form"
import { DataStorageService } from "@/services/data-storage-service"

export default function FamilySignaturePage() {
  const [user, setUser] = useState<{ id: string; name: string; medicalNotes?: string } | null>(null)

  useEffect(() => {
    const profiles = DataStorageService.getAllUserProfiles()
    if (profiles && profiles.length > 0) {
      const p = profiles[0]
      setUser({ id: p.id, name: p.name || "利用者", medicalNotes: p.notes || "" })
    } else {
      setUser({ id: "sample-1", name: "利用者サンプル", medicalNotes: "特記事項はありません" })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">家族署名フォーム</h1>
          <Link href="/" className="text-sm text-primary">← ホームへ戻る</Link>
        </div>

        {!user ? (
          <div className="p-6 bg-card rounded">読み込み中...</div>
        ) : (
          <FamilySignatureForm user={user} />
        )}
      </div>
    </div>
  )
}
