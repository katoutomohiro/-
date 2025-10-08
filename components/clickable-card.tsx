"use client"

import React, { useEffect, useRef } from "react"

type Props = React.HTMLAttributes<HTMLDivElement> & {
  onClick?: (e: React.MouseEvent) => void
}

const EMOJIS = ["⭐", "✨", "💖", "🌸", "💫", "🌟", "❤️"]

function ensureParticleStyle() {
  if (document.getElementById("v0-particle-style")) return
  const style = document.createElement("style")
  style.id = "v0-particle-style"
  style.innerHTML = `
  @keyframes v0-particle-up {
    0% { opacity: 1; transform: translateY(0) scale(1) rotate(0deg); }
    100% { opacity: 0; transform: translateY(-80px) scale(1.2) rotate(360deg); }
  }
  .v0-particle {
    position: fixed;
    pointer-events: none;
    font-size: 20px;
    will-change: transform, opacity;
    animation: v0-particle-up 800ms ease-out forwards;
    z-index: 9999;
    user-select: none;
  }
  `
  document.head.appendChild(style)
}

export default function ClickableCard({ children, onClick, className = "", ...rest }: Props) {
  const mounted = useRef(false)

  useEffect(() => {
    console.log("[v0] ClickableCard mounted")
    mounted.current = true
    ensureParticleStyle()
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    console.log("[v0] ClickableCard clicked")
    try {
      createParticles(e.clientX, e.clientY)
    } catch (err) {
      // ignore
    }
    if (onClick) onClick(e)
  }

  function createParticles(x: number, y: number) {
    console.log("[v0] Creating particles")
    const count = 10
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span")
      span.className = "v0-particle"
      span.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      const dx = (Math.random() - 0.5) * 80
      const left = x + dx
      const top = y + (Math.random() - 0.5) * 20
      span.style.left = `${left}px`
      span.style.top = `${top}px`
      span.style.opacity = "1"
      span.style.transform = `translateY(0) scale(${0.9 + Math.random() * 0.6}) rotate(${Math.random() * 60 - 30}deg)`
      document.body.appendChild(span)
      // remove after animation
      setTimeout(() => {
        try {
          span.remove()
        } catch (e) {}
      }, 900)
    }
  }

  return (
    <div
      {...rest}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick(e as any)
      }}
      className={className}
    >
      {children}
    </div>
  )
}
