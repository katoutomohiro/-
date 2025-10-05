"use client"

import { useMemo } from "react"

function simplifyMedicalText(text: string) {
  // naive simplification: replace some common technical terms with plain language
  return text
    .replace(/経管栄養/g, "経管栄養（チューブでの栄養）")
    .replace(/吸引/g, "吸引（気道のすすぎ）")
    .replace(/気管切開/g, "気管切開（呼吸のための開口）")
    .replace(/人工呼吸器/g, "人工呼吸器（呼吸を助ける機械）")
}

export default function MedicalSummaryGenerator({ medicalNotes }: { medicalNotes: string }) {
  const plain = useMemo(() => simplifyMedicalText(medicalNotes || "特記事項はありません"), [medicalNotes])

  return (
    <div className="p-4 bg-card rounded-md">
      <h3 className="text-lg font-semibold mb-2">医療サマリー（家族向け）</h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">{plain}</p>
      <div className="mt-3 p-2 bg-muted rounded">
        <strong>重要事項:</strong>
        <ul className="list-disc ml-5 mt-2 text-sm">
          <li>アレルギーや薬剤副作用がある場合は必ず記載してください。</li>
          <li>吸引や経管栄養が必要な場合は、実施方法と緊急時の連絡先を明記してください。</li>
        </ul>
      </div>
    </div>
  )
}
