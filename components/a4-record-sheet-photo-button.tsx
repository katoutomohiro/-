"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera } from 'lucide-react'
import { PhotoUpload } from "@/components/photo-upload"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DataStorageService } from "@/services/data-storage-service"
import { useToast } from "@/hooks/use-toast"

interface A4RecordSheetPhotoButtonProps {
  eventId: string
  currentPhotos: string[]
  onPhotosUpdated: () => void
}

export function A4RecordSheetPhotoButton({
  eventId,
  currentPhotos,
  onPhotosUpdated,
}: A4RecordSheetPhotoButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [photos, setPhotos] = useState<string[]>(currentPhotos)
  const { toast } = useToast()

  const handleSave = () => {
    const event = DataStorageService.getCareEventById(eventId)
    if (event) {
      DataStorageService.saveCareEvent({
        ...event,
        photos,
      })
      toast({
        title: "写真を保存しました",
        description: `${photos.length}枚の写真を追加しました`,
      })
      setIsOpen(false)
      onPhotosUpdated()
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="print:hidden"
      >
        <Camera className="h-4 w-4 mr-2" />
        写真追加 ({currentPhotos.length}/3)
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>写真を追加</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <PhotoUpload photos={photos} onChange={setPhotos} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
