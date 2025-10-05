"use client"

import { useEffect, useState } from "react"
import { generateQRCodeDataUrl } from "@/lib/qr-code-utils"

export default function QRCodeGenerator({ text, width = 240 }: { text: string; width?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("")

  useEffect(() => {
    let mounted = true
    generateQRCodeDataUrl(text, { width }).then((d) => {
      if (mounted) setDataUrl(d)
    })
    return () => {
      mounted = false
    }
  }, [text, width])

  if (!dataUrl) return <div className="text-sm text-muted-foreground">QRを生成中...</div>

  return (
    <div className="flex items-center justify-center">
      <img src={dataUrl} alt="QR code" width={width} height={width} />
    </div>
  )
}
