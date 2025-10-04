"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getDailyCareUsers } from "@/lib/data/users-data"

export default function DailyCareUsersPage() {
  const users = getDailyCareUsers()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">生活介護 - 利用者一覧</h1>
          <p className="text-muted-foreground mt-2">登録利用者数: {users.length}名</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            ダッシュボードに戻る
          </Button>
          <Button onClick={() => window.location.reload()}>更新</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href={`/daily-care/users/${user.id}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">{user.age}歳</Badge>
                  <Badge variant="outline">{user.gender === "male" ? "男性" : "女性"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">障害</p>
                  <p className="text-sm text-muted-foreground">{user.disability}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground">介護度</p>
                  <Badge variant="destructive" className="text-xs">
                    {user.nursingLevel}
                  </Badge>
                </div>

                {user.medicalCare.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground">医療的ケア</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.medicalCare.map((care, index) => (
                        <Badge key={index} variant="default" className="text-xs">
                          {care}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user.notes && (
                  <div>
                    <p className="text-sm font-medium text-foreground">備考</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{user.notes}</p>
                  </div>
                )}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>利用者が見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">生活介護の利用者データがまだ登録されていません。</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}