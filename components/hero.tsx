"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, History, Shield, Zap, Download, Cloud } from "lucide-react"

export function Hero() {
  const [historyShown, setHistoryShown] = useState(false)

  useEffect(() => {
    const onChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail as { showHistory?: boolean } | undefined
      if (detail && typeof detail.showHistory === 'boolean') {
        setHistoryShown(detail.showHistory)
      }
    }
    window.addEventListener('zinq:history-changed', onChanged as any)
    return () => window.removeEventListener('zinq:history-changed', onChanged as any)
  }, [])

  return (
    <section className="relative">
      {/* background grid + glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
  <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_70%)]" />
      </div>

      <div className="container mx-auto max-w-6xl px-4 pt-20 pb-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left: copy */}
          <div className="mx-auto text-center md:text-left max-w-3xl md:max-w-none">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-in delay-0">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Powerful, beautiful QR codes
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight balance animate-fade-up delay-100 whitespace-nowrap">
              Generate, style, and share <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">QR codes</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground pretty animate-fade-up delay-200">
              An elegant, fast QR generator with advanced customization, inspired by modern cloud UIs.
            </p>
            <div className="mt-6 flex items-center gap-3 justify-center md:justify-start animate-fade-up delay-300">
              <a href="#app">
                <Button size="lg" className="gap-2">
                  Start generating
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => {
                  setHistoryShown((v) => !v)
                  window.dispatchEvent(new CustomEvent('zinq:toggle-history'))
                }}
              >
                <History className="h-4 w-4" />
                {historyShown ? 'Hide history' : 'View history'}
              </Button>
            </div>

            {/* Highlights bar */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-90">
              <div className="flex items-center justify-center rounded-full border bg-card/40 px-4 py-2 gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>Privacy‑first</span>
              </div>
              <div className="flex items-center justify-center rounded-full border bg-card/40 px-4 py-2 gap-2 text-sm text-muted-foreground">
                <Zap className="h-4 w-4 text-primary" />
                <span>Offline‑first</span>
              </div>
              <div className="flex items-center justify-center rounded-full border bg-card/40 px-4 py-2 gap-2 text-sm text-muted-foreground">
                <Download className="h-4 w-4 text-primary" />
                <span>SVG/PNG export</span>
              </div>
              <div className="flex items-center justify-center rounded-full border bg-card/40 px-4 py-2 gap-2 text-sm text-muted-foreground">
                <Cloud className="h-4 w-4 text-primary" />
                <span>Installable PWA</span>
              </div>
            </div>
          </div>

          {/* Right: mascot */}
          <div className="relative flex justify-center md:justify-end">
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]">
              <div className="absolute -inset-6 rounded-full bg-[radial-gradient(60%_60%_at_50%_40%,color-mix(in_oklab,var(--primary)_35%,transparent),transparent_70%)]" aria-hidden />
              <Image
                src="/mascot.png"
                alt="Zinq mascot"
                fill
                priority
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 340px, 420px"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
