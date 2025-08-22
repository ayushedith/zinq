"use client"

import { useEffect } from "react"

// Extracts a simple palette from /mascot.png and applies it to CSS variables
export function ThemeFromImage() {
  useEffect(() => {
    const img = new Image()
    img.src = "/mascot.png"
    img.crossOrigin = "anonymous"
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const size = 64
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)

        // Quantize into buckets and count occurrences
        const buckets = new Map<string, { r: number; g: number; b: number; n: number }>()
        // Skip transparent/near-white/near-black background bias by thresholding alpha and luminance
        for (let i = 0; i < data.length; i += 4 * 4) { // sample every 4 pixels
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          const a = data[i + 3]
          if (a < 200) continue
          const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
          if (lum < 10 || lum > 245) continue // ignore extremes
          // 16-level per channel quantization
          const qr = r >> 4, qg = g >> 4, qb = b >> 4
          const key = `${qr},${qg},${qb}`
          const rec = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 }
          rec.r += r; rec.g += g; rec.b += b; rec.n++
          buckets.set(key, rec)
        }

        const entries = Array.from(buckets.entries())
          .map(([k, v]) => ({ k, r: Math.round(v.r / v.n), g: Math.round(v.g / v.n), b: Math.round(v.b / v.n), n: v.n }))
          // Prefer more saturated colors: score by count * saturation
          .map((e) => {
            const max = Math.max(e.r, e.g, e.b)
            const min = Math.min(e.r, e.g, e.b)
            const sat = max === 0 ? 0 : (max - min) / max
            return { ...e, score: e.n * (0.6 + 0.4 * sat) }
          })
          .sort((a, b) => b.score - a.score)

        if (!entries.length) return

        const toHex = (x: number) => x.toString(16).padStart(2, "0")
        const hex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`
        const dist2 = (a: { r: number; g: number; b: number }, d: { r: number; g: number; b: number }) => {
          const dr = a.r - d.r, dg = a.g - d.g, db = a.b - d.b
          return dr * dr + dg * dg + db * db
        }

        const primary = entries[0]
        // Pick the farthest among top candidates as accent, else complement
        let accent = entries.slice(1, 10).sort((a, b) => dist2(b, primary) - dist2(a, primary))[0]
        if (!accent) {
          const cr = 255 - primary.r, cg = 255 - primary.g, cb = 255 - primary.b
          accent = { r: cr, g: cg, b: cb, n: 1, k: "c", score: 0 }
        }

        const primaryHex = hex(primary.r, primary.g, primary.b)
        const accentHex = hex(accent.r, accent.g, accent.b)

        const toLin = (c: number) => {
          const x = c / 255
          return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
        }
        const luminance = (r: number, g: number, b: number) => 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b)
        const fgFor = (r: number, g: number, b: number) => (luminance(r, g, b) < 0.5 ? "#ffffff" : "#0a0a0a")
        const primaryFg = fgFor(primary.r, primary.g, primary.b)
        const accentFg = fgFor(accent.r, accent.g, accent.b)

        const root = document.documentElement
        root.style.setProperty("--primary", primaryHex)
        root.style.setProperty("--accent", accentHex)
  root.style.setProperty("--ring", primaryHex)
  root.style.setProperty("--primary-foreground", primaryFg)
  root.style.setProperty("--accent-foreground", accentFg)
        // Optional: adjust chart colors roughly around the palette
        root.style.setProperty("--chart-1", primaryHex)
        root.style.setProperty("--chart-3", accentHex)
      } catch {
        // ignore
      }
    }
  }, [])

  return null
}
