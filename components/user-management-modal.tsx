"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DataStorageService, type UserProfile } from "@/services/data-storage-service"

interface UserManagementModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string | null
  onSaved?: (user: UserProfile) => void
}

export default function UserManagementModal({ isOpen, onClose, userId, onSaved }: UserManagementModalProps) {
  const [profile, setProfile] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    if (isOpen && userId) {
      const existing = DataStorageService.getUserProfile(userId)
      if (existing) setProfile(existing)
    } else if (isOpen && !userId) {
      setProfile({ name: "", furigana: "", serviceType: "daily-care", createdAt: "", updatedAt: "" })
    }
  }, [isOpen, userId])

  const handleChange = (key: keyof UserProfile, value: any) => {
    setProfile((p) => ({ ...(p as any), [key]: value }))
  }

  const handleSave = () => {
    // Prepare payload for saveUserProfile: omit id/createdAt/updatedAt per service signature
    const payload: any = {
      name: profile.name || "",
      furigana: profile.furigana || "",
      age: profile.age,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth,
      serviceType: profile.serviceType || "daily-care",
      disabilityLevel: profile.disabilityLevel,
      medicalCareNeeds: profile.medicalCareNeeds || [],
      guardianName: profile.guardianName,
      guardianPhone: profile.guardianPhone,
      address: profile.address,
      careLevel: profile.careLevel,
      notes: profile.notes,
    }

    const saved = DataStorageService.saveUserProfile(payload)
    if (onSaved) onSaved(saved)
    onClose()
  }

  const handleDelete = () => {
    if (!userId) return
    DataStorageService.deleteUserProfile(userId)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[95vw]">
        <DialogTitle>{userId ? "利用者を編集" : "利用者を追加"}</DialogTitle>
        <DialogDescription className="mb-4">利用者の基本情報を入力してください</DialogDescription>

        <div className="grid gap-3">
          <div>
            <Label>名前</Label>
            <Input value={profile.name || ""} onChange={(e) => handleChange("name" as any, e.target.value)} />
          </div>

          <div>
            <Label>ふりがな</Label>
            <Input value={profile.furigana || ""} onChange={(e) => handleChange("furigana" as any, e.target.value)} />
          </div>

          <div>
            <Label>年齢</Label>
            <Input type="number" value={profile.age ?? ""} onChange={(e) => handleChange("age" as any, Number(e.target.value))} />
          </div>

          <div>
            <Label>サービス種別</Label>
            <select value={profile.serviceType || "daily-care"} onChange={(e) => handleChange("serviceType" as any, e.target.value)} className="w-full p-2 border rounded">
              <option value="daily-care">生活介護</option>
              <option value="after-school">放課後等デイサービス</option>
            </select>
          </div>

          <div>
            <Label>備考</Label>
            <Input value={profile.notes || ""} onChange={(e) => handleChange("notes" as any, e.target.value)} />
          </div>

          <div className="flex gap-2 justify-end mt-4">
            {userId && (
              <Button variant="destructive" onClick={handleDelete}>
                削除
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
