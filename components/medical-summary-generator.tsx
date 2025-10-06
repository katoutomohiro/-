"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { simplifyMedicalTerms } from "@/lib/medical-term-simplifier"

interface MedicalSummaryProps {
  userId: string
  userName: string
  careEvents: any[]
}

export function MedicalSummaryGenerator({ userId, userName, careEvents }: MedicalSummaryProps) {
  const generateSummary = () => {
    const seizureEvents = careEvents.filter((e) => e.eventType === "seizure")
    const vitalEvents = careEvents.filter((e) => e.eventType === "vitals")
    const medicationEvents = careEvents.filter((e) => e.eventType === "medication")

    return {
      seizures: {
        count: seizureEvents.length,
        lastOccurrence: seizureEvents[0]?.timestamp || "記録なし",
        simplified: simplifyMedicalTerms("発作"),
      },
      vitals: {
        latest: vitalEvents[0] || null,
        simplified: simplifyMedicalTerms("バイタルサイン"),
      },
      medications: {
        count: medicationEvents.length,
        simplified: simplifyMedicalTerms("服薬"),
      },
    }
  }

  const summary = generateSummary()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            医療サマリー（家族向け）
            <Badge variant="secondary">自動生成</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">利用者情報</h3>
            <p className="text-sm">
              <span className="font-medium">氏名：</span>
              {userName}
            </p>
            <p className="text-sm">
              <span className="font-medium">ID：</span>
              {userId}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{summary.seizures.simplified.term}</h3>
            <p className="text-sm text-gray-600 mb-2">{summary.seizures.simplified.explanation}</p>
            <p className="text-sm">
              <span className="font-medium">記録回数：</span>
              {summary.seizures.count}回
            </p>
            <p className="text-sm">
              <span className="font-medium">最終発生：</span>
              {summary.seizures.lastOccurrence}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{summary.vitals.simplified.term}</h3>
            <p className="text-sm text-gray-600 mb-2">{summary.vitals.simplified.explanation}</p>
            {summary.vitals.latest && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-medium">体温：</span>
                  {summary.vitals.latest.temperature || "未記録"}°C
                </p>
                <p>
                  <span className="font-medium">血圧：</span>
                  {summary.vitals.latest.bloodPressure || "未記録"}
                </p>
                <p>
                  <span className="font-medium">脈拍：</span>
                  {summary.vitals.latest.pulse || "未記録"}bpm
                </p>
                <p>
                  <span className="font-medium">SpO2：</span>
                  {summary.vitals.latest.spo2 || "未記録"}%
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">{summary.medications.simplified.term}</h3>
            <p className="text-sm text-gray-600 mb-2">{summary.medications.simplified.explanation}</p>
            <p className="text-sm">
              <span className="font-medium">記録回数：</span>
              {summary.medications.count}回
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
            <h4 className="font-semibold text-blue-900 mb-2">ご家族へのメッセージ</h4>
            <p className="text-sm text-blue-800">
              このサマリーは、専門的な医療用語を分かりやすく説明したものです。詳細な医療情報については、担当医師または看護師にお尋ねください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
