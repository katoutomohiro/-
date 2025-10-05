"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import UserManagementModal from "@/components/user-management-modal"
import { Badge } from "@/components/ui/badge"
import { DataStorageService, type UserProfile } from "@/services/data-storage-service"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { initializeRealUsersData } from "@/lib/data/users-data"

export default function DailyCareUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    initializeRealUsersData()

    const allUsers = DataStorageService.getAllUserProfiles()
    const dailyCareUsers = allUsers.filter((user) => user.serviceType === "daily-care")

    setUsers(dailyCareUsers)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">生活介護 - 利用者一覧</h1>
              <p className="text-muted-foreground font-medium">
                日中活動・創作活動・生産活動の記録と支援計画管理（{users.length}名）
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="default" onClick={() => { setEditingUserId(null); setIsModalOpen(true) }}>利用者を追加</Button>
              <Link href="/">
                <Button variant="outline">ダッシュボードに戻る</Button>
              </Link>
            </div>
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
                    {user.furigana && <p className="text-xs text-muted-foreground mt-1">{user.furigana}</p>}
                    <Badge variant="secondary" className="mt-2">
                      生活介護
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  {user.age && <p>年齢: {user.age}歳</p>}
                  {user.careLevel && <p>介護度: {user.careLevel}</p>}
                  {user.medicalCareNeeds && user.medicalCareNeeds.length > 0 && (
                    <p className="text-xs">
                      医療的ケア: <span className="font-medium">{user.medicalCareNeeds.join("・")}</span>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => router.push(`/daily-care/users/${user.id}`)}>
                    ケース記録を見る
                  </Button>
                  <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setEditingUserId(user.id); setIsModalOpen(true) }}>
                    編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <UserManagementModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingUserId(null); const all = DataStorageService.getAllUserProfiles(); setUsers(all.filter(u => u.serviceType === "daily-care")) }}
        userId={editingUserId || undefined}
        onSaved={(u) => { const all = DataStorageService.getAllUserProfiles(); setUsers(all.filter(us => us.serviceType === "daily-care")) }}
      />
    </div>
  )
}
