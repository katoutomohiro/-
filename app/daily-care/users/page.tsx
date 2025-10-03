"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataStorageService, type UserProfile } from "@/services/data-storage-service"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DailyCareUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const router = useRouter()

  useEffect(() => {
    const allUsers = DataStorageService.getAllUserProfiles()
    const dailyCareUsers = allUsers.filter((user) => user.serviceType === "daily-care")

    if (dailyCareUsers.length === 0) {
      const defaultUsers = Array.from({ length: 14 }, (_, i) => ({
        name: `生活介護利用者${String.fromCharCode(65 + i)}`,
        serviceType: "daily-care" as const,
      }))

      const createdUsers = defaultUsers.map((user) => DataStorageService.saveUserProfile(user as any))
      setUsers(createdUsers)
    } else {
      setUsers(dailyCareUsers)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">生活介護 - 利用者一覧</h1>
              <p className="text-muted-foreground font-medium">日中活動・創作活動・生産活動の記録と支援計画管理</p>
            </div>
            <Link href="/">
              <Button variant="outline">ダッシュボードに戻る</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-[1.02]"
              onClick={() => router.push(`/daily-care/users/${user.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600 text-2xl transition-all duration-300 group-hover:scale-110">
                    👤
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{user.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">生活介護</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  {user.dateOfBirth && (
                    <p>生年月日: {new Date(user.dateOfBirth).toLocaleDateString("ja-JP")}</p>
                  )}
                  {user.careLevel && <p>介護度: {user.careLevel}</p>}
                </div>
                <Button size="sm" className="w-full">
                  ケース記録を見る
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
