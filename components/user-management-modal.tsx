"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { DataStorageService, type UserProfile } from "@/services/data-storage-service"

interface UserManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: UserProfile | null
  serviceType: "daily-care" | "after-school"
  onSave: () => void
}

export function UserManagementModal({ open, onOpenChange, user, serviceType, onSave }: UserManagementModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    furigana: "",
    age: "",
    gender: "male" as "male" | "female" | "other",
    dateOfBirth: "",
    disabilityLevel: "",
    careLevel: "",
    notes: "",
    medicalCareNeeds: [] as string[],
  })

  const [newMedicalCare, setNewMedicalCare] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        furigana: user.furigana || "",
        age: user.age?.toString() || "",
        gender: user.gender || "male",
        dateOfBirth: user.dateOfBirth || "",
        disabilityLevel: user.disabilityLevel || "",
        careLevel: user.careLevel || "",
        notes: user.notes || "",
        medicalCareNeeds: user.medicalCareNeeds || [],
      })
    } else {
      setFormData({
        name: "",
        furigana: "",
        age: "",
        gender: "male",
        dateOfBirth: "",
        disabilityLevel: "",
        careLevel: "",
        notes: "",
        medicalCareNeeds: [],
      })
    }
  }, [user, open])

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("利用者名を入力してください")
      return
    }

    const profileData: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      furigana: formData.furigana,
      age: formData.age ? Number.parseInt(formData.age) : undefined,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      serviceType: serviceType,
      disabilityLevel: formData.disabilityLevel,
      medicalCareNeeds: formData.medicalCareNeeds,
      careLevel: formData.careLevel,
      notes: formData.notes,
    }

    if (user) {
      // 既存利用者の更新
      DataStorageService.saveUserProfile({
        ...profileData,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: new Date().toISOString(),
      } as UserProfile)
    } else {
      // 新規利用者の追加
      DataStorageService.saveUserProfile(profileData)
    }

    onSave()
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (!user) return

    if (confirm(`${user.name}さんを削除してもよろしいですか？\nこの操作は取り消せません。`)) {
      DataStorageService.deleteUserProfile(user.id)
      onSave()
      onOpenChange(false)
    }
  }

  const addMedicalCare = () => {
    if (newMedicalCare.trim() && !formData.medicalCareNeeds.includes(newMedicalCare.trim())) {
      setFormData({
        ...formData,
        medicalCareNeeds: [...formData.medicalCareNeeds, newMedicalCare.trim()],
      })
      setNewMedicalCare("")
    }
  }

  const removeMedicalCare = (care: string) => {
    setFormData({
      ...formData,
      medicalCareNeeds: formData.medicalCareNeeds.filter((c) => c !== care),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full flex flex-col p-0 bg-white dark:bg-gray-950 shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white dark:bg-gray-950">
          <DialogTitle className="text-xl">{user ? "利用者情報の編集" : "新しい利用者の追加"}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 bg-white dark:bg-gray-950">
          <div className="space-y-6 py-4">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-muted-foreground border-b pb-2">基本情報</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    利用者名 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例: A・T"
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="furigana" className="text-sm font-medium">
                    ふりがな
                  </Label>
                  <Input
                    id="furigana"
                    value={formData.furigana}
                    onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                    placeholder="例: えー・てぃー"
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm font-medium">
                    年齢
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="例: 36"
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-sm font-medium">
                    性別
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: any) => setFormData({ ...formData, gender: value })}
                  >
                    <SelectTrigger id="gender" className="h-10 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">男性</SelectItem>
                      <SelectItem value="female">女性</SelectItem>
                      <SelectItem value="other">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                    生年月日
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="h-10 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careLevel" className="text-sm font-medium">
                    介護度
                  </Label>
                  <Input
                    id="careLevel"
                    value={formData.careLevel}
                    onChange={(e) => setFormData({ ...formData, careLevel: e.target.value })}
                    placeholder="例: 全介助"
                    className="h-10 text-base"
                  />
                </div>
              </div>
            </div>

            {/* 障害・支援度情報 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-muted-foreground border-b pb-2">障害・支援度情報</h3>

              <div className="space-y-2">
                <Label htmlFor="disabilityLevel" className="text-sm font-medium">
                  障害程度・支援度
                </Label>
                <Textarea
                  id="disabilityLevel"
                  value={formData.disabilityLevel}
                  onChange={(e) => setFormData({ ...formData, disabilityLevel: e.target.value })}
                  placeholder="例: 重症心身障害者、障害支援区分6、療育手帳A"
                  rows={3}
                  className="resize-none text-base"
                />
              </div>
            </div>

            {/* 医療的ケア */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base text-muted-foreground border-b pb-2">医療的ケア</h3>

              <div className="flex gap-2">
                <Input
                  value={newMedicalCare}
                  onChange={(e) => setNewMedicalCare(e.target.value)}
                  placeholder="医療的ケアを入力（例: 吸引、経管栄養、気管切開）"
                  className="h-10 text-base"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addMedicalCare()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addMedicalCare}
                  variant="outline"
                  className="h-10 px-6 text-base bg-transparent"
                >
                  追加
                </Button>
              </div>

              {formData.medicalCareNeeds.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md min-h-[60px]">
                  {formData.medicalCareNeeds.map((care) => (
                    <Badge key={care} variant="secondary" className="gap-1 h-7 px-3 text-sm">
                      {care}
                      <button
                        type="button"
                        onClick={() => removeMedicalCare(care)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 備考 */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                備考（基礎疾患・その他特記事項）
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="基礎疾患、その他特記事項を入力してください"
                rows={4}
                className="resize-none text-base"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between border-t px-6 py-4 bg-white dark:bg-gray-950">
          <div>
            {user && (
              <Button type="button" variant="destructive" onClick={handleDelete} className="h-10 px-6 text-base">
                削除
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-10 px-6 text-base">
              キャンセル
            </Button>
            <Button type="button" onClick={handleSave} className="h-10 px-6 text-base">
              保存
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
