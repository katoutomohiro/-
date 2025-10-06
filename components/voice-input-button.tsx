"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void
  className?: string
  size?: "sm" | "default" | "lg"
}

export function VoiceInputButton({ onTranscript, className = "", size = "default" }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.lang = "ja-JP"
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          onTranscript(transcript)
          setIsListening(false)
          toast({
            title: "音声入力完了",
            description: `「${transcript}」を入力しました`,
          })
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("音声認識エラー:", event.error)
          setIsListening(false)
          toast({
            title: "音声入力エラー",
            description: "音声認識に失敗しました。もう一度お試しください。",
            variant: "destructive",
          })
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onTranscript, toast])

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: "音声入力非対応",
        description: "お使いのブラウザは音声入力に対応していません。",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
        toast({
          title: "音声入力開始",
          description: "話してください...",
        })
      } catch (error) {
        console.error("音声認識開始エラー:", error)
        toast({
          title: "音声入力エラー",
          description: "音声認識を開始できませんでした。",
          variant: "destructive",
        })
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size={size}
      onClick={toggleListening}
      className={`transition-all duration-300 ${isListening ? "animate-pulse" : ""} ${className}`}
      title={isListening ? "音声入力を停止" : "音声入力を開始"}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          停止
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          音声入力
        </>
      )}
    </Button>
  )
}
