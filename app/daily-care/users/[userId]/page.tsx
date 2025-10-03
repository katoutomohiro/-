"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataStorageService, type UserProfile, type CaseRecord } from "@/services/data-storage-service"
import CaseRecordSheet from "@/components/case-record-sheet"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DailyCareUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.userId as string
  
  const [user, setUser] = useState<UserProfile | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null)
  const [viewMode, setViewMode] = useState<"single" | "multiple">("single")
  
  useEffect(() => {
    // 利用者情報を取得
    const userProfile = DataStorageService.getUserProfile(userId)
    setUser(userProfile)
    
    if (!userProfile) {
      console.error("[v0] User not found:", userId)
      return
    }
    
    // ケース記録を取得
    const dateStr = format(selectedDate, "yyyy-MM-dd")
    let record = DataStorageService.getCaseRecordByDate(userId, dateStr)
    
    if (!record) {
      // 新規レコードを作成
      record = DataStorageService.saveCaseRecord({
        userId,
        date: dateStr,
        dayOfWeek: format(selectedDate, "E", { locale: ja }),
      } as any)
    }
    
    setCaseRecord(record)
  }, [userId, selectedDate])
  
  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDate(newDate)
  }
  
  const handleNextDay = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDate(newDate)
  }
  
  const handleSave = (updatedRecord: CaseRecord) => {
    DataStorageService.saveCaseRecord(updatedRecord)
    setCaseRecord(updatedRecord)
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">利用者情報を読み込んでいます...</p>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {user.name} - ケース記録・サービス実績表
              </h1>
              <p className="text-muted-foreground font-medium">生活介護</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/daily-care/users") }>
                一覧に戻る
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "single" | "multiple")}>
          <TabsList className="mb-4">
            <TabsTrigger value="single">1日表示</TabsTrigger>
            <TabsTrigger value="multiple">複数日表示</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>日付選択</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" onClick={handlePreviousDay}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-lg font-semibold min-w-[200px] text-center">
                    {format(selectedDate, "yyyy年MM月dd日（E）", { locale: ja })}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleNextDay}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {caseRecord && (
              <CaseRecordSheet
                record={caseRecord}
                user={user}
                onSave={handleSave}
              />
            )}
          </TabsContent>
          
          <TabsContent value="multiple">
            <Card>
              <CardHeader>
                <CardTitle>複数日表示</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">複数日分の記録を一覧表示します（実装予定）</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
