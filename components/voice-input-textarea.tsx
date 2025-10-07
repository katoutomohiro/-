"use client"
import { Textarea } from "@/components/ui/textarea"
import { VoiceInputButton } from "./voice-input-button"

interface VoiceInputTextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  label?: string
}

export function VoiceInputTextarea({
  value,
  onChange,
  placeholder = "テキストを入力または音声入力してください",
  className = "",
  rows = 4,
  label,
}: VoiceInputTextareaProps) {
  const handleVoiceTranscript = (transcript: string) => {
    const newValue = value ? `${value} ${transcript}` : transcript
    onChange(newValue)
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-24 ${className}`}
          rows={rows}
        />
        <div className="absolute bottom-2 right-2">
          <VoiceInputButton onTranscript={handleVoiceTranscript} />
        </div>
      </div>
    </div>
  )
}
