"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="w-10 h-10 bg-transparent">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-10 h-10 transition-all duration-300 hover:scale-110"
      title={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all duration-300" />
      )}
      <span className="sr-only">テーマを切り替え</span>
    </Button>
  )
}
