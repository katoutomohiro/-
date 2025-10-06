"use client"

import { Mic, MicOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  className?: string
}

export function VoiceInputButton({ onTranscript, className }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    )
  }, [])

  const startListening = () => {
    if (!isSupported) {
      toast({
        title: "音声認識非対応",
        description: "お使いのブラウザは音声認識に対応していません。Chrome、Edge、Safariをお試しください。",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "ja-JP"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      toast({
        title: "音声認識エラー",
        description: "音声認識中にエラーが発生しました。もう一度お試しください。",
        variant: "destructive",
      })
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      onClick={startListening}
      disabled={isListening}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">音声入力</span>
    </Button>
  )
}
