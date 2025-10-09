"use client"

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ServiceUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string
  const rawUserId = params.userId
  const userId = Array.isArray(rawUserId) ? decodeURIComponent(rawUserId[0] || '') : decodeURIComponent(rawUserId || '')

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // placeholder for potential async data fetch
    setTimeout(() => setLoaded(true), 100)
  }, [serviceId, userId])

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{userId || '利用者'} の詳細</h1>
          <Button variant="outline" onClick={() => router.back()}>
            ← 戻る
          </Button>
        </div>

        {!loaded ? (
          <p className="text-muted-foreground">読み込み中…</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border rounded">
              <p className="text-sm text-muted-foreground">サービス:</p>
              <p className="font-medium">{serviceId}</p>
            </div>
            <div className="p-4 border rounded">
              <p className="text-sm text-muted-foreground">備考</p>
              <p className="text-sm">ここに利用者の詳細が表示されます。サンプルのプレースホルダページです。</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
