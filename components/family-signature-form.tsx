"use client"

import QRCodeGenerator from "@/components/qr-code-generator"
import MedicalSummaryGenerator from "@/components/medical-summary-generator"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function FamilySignatureForm({ user }: { user: { id: string; name: string; medicalNotes?: string } }) {
  const [agreed, setAgreed] = useState(false)

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    const html = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>家族署名用フォーム - ${user.name}</title>
          <style>
            @page { size: A4; margin: 20mm }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color: #111 }
            .container { max-width: 210mm; margin: 0 auto }
            .header { display:flex; justify-content:space-between; align-items:center }
            .signature { margin-top: 24mm; }
            .signature-line { border-bottom: 1px solid #111; width: 60%; height: 28px }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>家族署名用同意書</h1>
            <p>利用者名: ${user.name}</p>
            <h2>同意事項</h2>
            <p>以下の内容に同意します。</p>
            <div>${user.medicalNotes || "特記事項なし"}</div>
            <div class="signature">
              <div>署名:</div>
              <div class="signature-line"></div>
              <div>日付: ____________________</div>
            </div>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">家族署名用同意書</h2>
          <p className="text-sm text-muted-foreground">利用者: {user.name}</p>
        </div>
        <div className="w-32">
          <QRCodeGenerator text={`https://example.local/user/${user.id}`} width={120} />
        </div>
      </div>

      <div className="space-y-4">
        <MedicalSummaryGenerator medicalNotes={user.medicalNotes || ""} />

        <div className="flex items-center gap-3">
          <input id="consent" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor="consent" className="text-sm">同意します（保護者署名が必要です）</label>
        </div>

        <div className="flex gap-3">
          <Button onClick={handlePrint} disabled={!agreed} className="ml-auto">
            印刷して署名
          </Button>
        </div>
      </div>
    </div>
  )
}
