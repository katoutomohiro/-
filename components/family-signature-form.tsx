"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { QRCodeGenerator } from "@/components/qr-code-generator"

interface FamilySignatureFormProps {
  userId: string
  userName: string
  onSubmit?: (data: FamilySignatureData) => void
}

export interface FamilySignatureData {
  userId: string
  userName: string
  guardianName: string
  relationship: string
  contactPhone: string
  contactEmail: string
  emergencyContact: string
  emergencyPhone: string
  consentItems: {
    medicalCare: boolean
    dataSharing: boolean
    emergencyTreatment: boolean
    photoUsage: boolean
  }
  signatureDate: string
  signature: string
}

export function FamilySignatureForm({ userId, userName, onSubmit }: FamilySignatureFormProps) {
  const [formData, setFormData] = useState<FamilySignatureData>({
    userId,
    userName,
    guardianName: "",
    relationship: "",
    contactPhone: "",
    contactEmail: "",
    emergencyContact: "",
    emergencyPhone: "",
    consentItems: {
      medicalCare: false,
      dataSharing: false,
      emergencyTreatment: false,
      photoUsage: false,
    },
    signatureDate: new Date().toISOString().split("T")[0],
    signature: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="text-center border-b-2 border-gray-800 pb-4">
          <h1 className="text-2xl font-bold mb-2">重症心身障がい児者支援サービス</h1>
          <h2 className="text-xl font-semibold">家族同意書・署名用紙</h2>
          <p className="text-sm text-gray-600 mt-2">PROJECT SOUL - 重心ケアシステム</p>
        </div>

        {/* 利用者情報 */}
        <Card>
          <CardHeader>
            <CardTitle>利用者情報</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label>利用者ID</Label>
              <p className="font-mono text-sm border p-2 rounded bg-gray-50">{userId}</p>
            </div>
            <div>
              <Label>利用者氏名</Label>
              <p className="font-semibold text-lg border p-2 rounded bg-gray-50">{userName}</p>
            </div>
          </CardContent>
        </Card>

        {/* 保護者情報 */}
        <Card>
          <CardHeader>
            <CardTitle>保護者・家族情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianName">保護者氏名 *</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  placeholder="山田 太郎"
                  required
                />
              </div>
              <div>
                <Label htmlFor="relationship">続柄 *</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="父"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactPhone">連絡先電話番号 *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="090-1234-5678"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">メールアドレス</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">緊急連絡先氏名 *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="山田 花子"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">緊急連絡先電話番号 *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  placeholder="080-9876-5432"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 同意事項 */}
        <Card>
          <CardHeader>
            <CardTitle>同意事項</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="medicalCare"
                checked={formData.consentItems.medicalCare}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    consentItems: { ...formData.consentItems, medicalCare: checked as boolean },
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="medicalCare" className="font-semibold cursor-pointer">
                  医療的ケアの実施について
                </Label>
                <p className="text-sm text-gray-600">
                  利用者の医療的ケア（吸引、経管栄養、服薬管理等）を施設スタッフが実施することに同意します。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="dataSharing"
                checked={formData.consentItems.dataSharing}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    consentItems: { ...formData.consentItems, dataSharing: checked as boolean },
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="dataSharing" className="font-semibold cursor-pointer">
                  情報共有について
                </Label>
                <p className="text-sm text-gray-600">
                  利用者の健康状態、ケア記録等の情報を、医療機関・関係機関と共有することに同意します。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="emergencyTreatment"
                checked={formData.consentItems.emergencyTreatment}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    consentItems: { ...formData.consentItems, emergencyTreatment: checked as boolean },
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="emergencyTreatment" className="font-semibold cursor-pointer">
                  緊急時の医療処置について
                </Label>
                <p className="text-sm text-gray-600">
                  緊急時に保護者への連絡が取れない場合、施設の判断で必要な医療処置を行うことに同意します。
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="photoUsage"
                checked={formData.consentItems.photoUsage}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    consentItems: { ...formData.consentItems, photoUsage: checked as boolean },
                  })
                }
              />
              <div className="space-y-1">
                <Label htmlFor="photoUsage" className="font-semibold cursor-pointer">
                  写真・動画の使用について
                </Label>
                <p className="text-sm text-gray-600">
                  活動記録のための写真・動画撮影、および施設内での掲示・記録への使用に同意します。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 署名欄 */}
        <Card>
          <CardHeader>
            <CardTitle>署名</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="signatureDate">署名日</Label>
              <Input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="signature">保護者署名</Label>
              <div className="border-2 border-gray-300 rounded p-4 min-h-[100px] bg-gray-50">
                <Input
                  id="signature"
                  value={formData.signature}
                  onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                  placeholder="ここに署名してください"
                  className="text-2xl font-serif"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">※ 印刷後、手書きで署名していただくことも可能です</p>
            </div>
          </CardContent>
        </Card>

        {/* QRコード */}
        <Card className="no-print">
          <CardHeader>
            <CardTitle>スマートフォン連携</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <QRCodeGenerator
                data={JSON.stringify({
                  userId,
                  userName,
                  type: "family-signature",
                  timestamp: new Date().toISOString(),
                })}
                size={150}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  このQRコードをスマートフォンで読み取ると、利用者情報や最新のケア記録にアクセスできます。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ボタン */}
        <div className="flex gap-4 no-print">
          <Button onClick={handlePrint} className="flex-1">
            印刷する
          </Button>
          <Button onClick={handleSubmit} variant="outline" className="flex-1 bg-transparent">
            保存する
          </Button>
        </div>

        {/* フッター */}
        <div className="text-center text-xs text-gray-500 border-t pt-4 mt-8">
          <p>PROJECT SOUL - 重症心身障がい児者支援システム</p>
          <p>本書類は法的要件に基づき作成されています</p>
        </div>
      </div>
    </div>
  )
}
