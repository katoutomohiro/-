"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataStorageService, type UserProfile } from "@/services/data-storage-service"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { initializeRealUsersData } from "@/lib/data/users-data"
import { UserManagementModal } from "@/components/user-management-modal"
import { Plus, Edit } from "lucide-react"

export default function AfterSchoolUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const router = useRouter()

  const loadUsers = () => {
    initializeRealUsersData()
    const allUsers = DataStorageService.getAllUserProfiles()
    const afterSchoolUsers = allUsers.filter((user) => user.serviceType === "after-school")
    setUsers(afterSchoolUsers)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSave = () => {
    loadUsers()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">放課後等デイサービス - 利用者一覧</h1>
              <p className="text-muted-foreground font-medium">
                学齢期の療育・集団活動・個別支援の記録（{users.length}名）
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser} className="gap-2">
                <Plus className="h-4 w-4" />
                利用者を追加
              </Button>
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
              onClick={() => router.push(`/after-school/users/${user.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-green-100 text-green-600 text-2xl transition-all duration-300 group-hover:scale-110">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">{user.name}</CardTitle>
                        {user.furigana && <p className="text-xs text-muted-foreground mt-1">{user.furigana}</p>}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleEditUser(user, e)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                      放課後等デイサービス
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  {user.age && <p>年齢: {user.age}歳</p>}
                  {user.careLevel && <p>支援度: {user.careLevel}</p>}
                  {user.medicalCareNeeds && user.medicalCareNeeds.length > 0 && (
                    <p className="text-xs">
                      医療的ケア: <span className="font-medium">{user.medicalCareNeeds.join("・")}</span>
                    </p>
                  )}
                </div>
                <Button size="sm" className="w-full">
                  ケース記録を見る
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <UserManagementModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        user={selectedUser}
        serviceType="after-school"
        onSave={handleSave}
      />
    </div>
  )
}
