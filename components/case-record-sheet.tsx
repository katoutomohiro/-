"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { CaseRecord, UserProfile } from "@/services/data-storage-service"

interface CaseRecordSheetProps {
  record: CaseRecord
  user: UserProfile
  onSave: (record: CaseRecord) => void
}

export function CaseRecordSheet({ record, user, onSave }: CaseRecordSheetProps) {
  const [editMode, setEditMode] = useState(false)
  const [localRecord, setLocalRecord] = useState<CaseRecord>(record)

  const handlePrint = () => {
    window.print()
  }

  const handleSave = () => {
    onSave(localRecord)
    setEditMode(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 print:hidden">
        {editMode ? (
          <>
            <Button onClick={handleSave}>保存</Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              キャンセル
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditMode(true)}>編集</Button>
            <Button variant="outline" onClick={handlePrint}>
              印刷
            </Button>
          </>
        )}
      </div>

      <div className="bg-white p-8 shadow-lg print:shadow-none" style={{ width: "210mm", minHeight: "297mm" }}>
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">{user.name} ケース記録・サービス実績表</h1>
          <p className="text-sm">
            令和 {localRecord.date.split("-")[0]} 年 {localRecord.date.split("-")[1]} 月{" "}
            {localRecord.date.split("-")[2]} 日（{localRecord.dayOfWeek}）
          </p>
        </div>

        <div className="mb-4">
          <h2 className="font-bold border-b mb-2">バイタル</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-1">時間</th>
                <th className="border p-1">体温</th>
              </tr>
            </thead>
            <tbody>
              {localRecord.vitals.map((vital, index) => (
                <tr key={index}>
                  <td className="border p-1">{vital.time}</td>
                  <td className="border p-1">{vital.temperature}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h2 className="font-bold border-b mb-2">排泄</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-1">時間</th>
                <th className="border p-1">尿</th>
                <th className="border p-1">便</th>
              </tr>
            </thead>
            <tbody>
              {localRecord.excretion.map((exc, index) => (
                <tr key={index}>
                  <td className="border p-1">{exc.time}</td>
                  <td className="border p-1">{exc.urine}</td>
                  <td className="border p-1">{exc.stool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-4">
          <h2 className="font-bold border-b mb-2">特記事項・活動</h2>
          <div className="border p-2">
            <p className="whitespace-pre-wrap">{localRecord.specialNotes || "記録なし"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
