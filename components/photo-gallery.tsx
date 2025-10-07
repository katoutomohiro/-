"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"

interface PhotoGalleryProps {
  photos?: string[]
  onDelete?: (index: number) => void
}

export default function PhotoGallery({ photos = [], onDelete }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  function openAt(i: number) {
    setCurrentIndex(i)
    setOpen(true)
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p, i) => (
          <div key={i} className="relative">
            <img
              src={p}
              alt={`photo-${i}`}
              className="w-full h-24 object-cover rounded-md cursor-pointer"
              onClick={() => openAt(i)}
            />
            <button
              className="absolute top-1 right-1 bg-white/80 text-black rounded px-1 py-0.5 text-xs"
              onClick={() => onDelete && onDelete(i)}
              aria-label={`Delete photo ${i + 1}`}
            >
              削除
            </button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl w-[95vw] p-2 bg-white dark:bg-gray-950">
          <DialogHeader>
            <DialogTitle>写真プレビュー</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-2">
            {photos[currentIndex] && (
              <img src={photos[currentIndex]} alt={`preview-${currentIndex}`} className="max-h-[80vh] object-contain" />
            )}

            <div className="flex gap-2">
              <Button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}>
                前へ
              </Button>
              <Button onClick={() => setCurrentIndex((i) => Math.min(photos.length - 1, i + 1))} disabled={currentIndex >= photos.length - 1}>
                次へ
              </Button>
              <Button variant="destructive" onClick={() => {
                if (onDelete) onDelete(currentIndex)
                setOpen(false)
              }}>
                削除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
