"use client"

import React, { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

interface PhotoUploadProps {
  photos?: string[]
  onChange?: (photos: string[]) => void
  maxPhotos?: number
  maxSizeKB?: number
}

export default function PhotoUpload({ photos = [], onChange, maxPhotos = 3, maxSizeKB = 500 }: PhotoUploadProps) {
  const [localPhotos, setLocalPhotos] = useState<string[]>(photos)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(String(reader.result))
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return

    const next: string[] = [...localPhotos]

    for (let i = 0; i < files.length; i++) {
      if (next.length >= maxPhotos) break
      const f = files[i]
      const sizeKB = f.size / 1024
      if (sizeKB > maxSizeKB) {
        // skip too large files
        // keep behavior simple: ignore oversize
        continue
      }

      try {
        const dataUrl = await toBase64(f)
        next.push(dataUrl)
      } catch (e) {
        console.error("Failed to read file", e)
      }
    }

    setLocalPhotos(next)
    onChange && onChange(next)
  }

  function removeAt(index: number) {
    const copy = [...localPhotos]
    copy.splice(index, 1)
    setLocalPhotos(copy)
    onChange && onChange(copy)
  }

  return (
    <Card className="p-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={localPhotos.length >= maxPhotos}
            size="sm"
          >
            写真を追加 ({localPhotos.length}/{maxPhotos})
          </Button>
          <div className="text-sm text-muted-foreground">1枚あたり最大 {maxSizeKB}KB</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {localPhotos.map((p, idx) => (
            <div key={idx} className="relative">
              <img src={p} alt={`photo-${idx}`} className="w-full h-24 object-cover rounded-md" />
              <button
                className="absolute top-1 right-1 bg-white/80 text-black rounded px-1 py-0.5 text-xs"
                onClick={() => removeAt(idx)}
                aria-label={`Remove photo ${idx + 1}`}
              >
                削除
              </button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
