"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  QrCode,
  Download,
  Link,
  Sparkles,
  Palette,
  Upload,
  ArrowRight,
  Shield,
  Cloud,
  Zap,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  User,
  History,
  Settings,
  Trash2,
  Copy,
  Star,
} from "lucide-react"
import QRCode from "qrcode"
import { Hero } from "@/components/hero"
import { toast } from "@/hooks/use-toast"

const backgroundPatterns = [
  { name: "Clean", class: "bg-white", preview: "bg-white" },
  {
    name: "Emerald Gradient",
    class: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    preview: "bg-gradient-to-br from-emerald-400 to-emerald-600",
  },
  {
    name: "Ocean Wave",
    class: "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600",
    preview: "bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600",
  },
  {
    name: "Sunset",
    class: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    preview: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
  },
  {
    name: "Forest",
    class: "bg-gradient-to-br from-green-400 to-emerald-700",
    preview: "bg-gradient-to-br from-green-400 to-emerald-700",
  },
  {
    name: "Midnight",
    class: "bg-gradient-to-br from-slate-800 to-slate-900",
    preview: "bg-gradient-to-br from-slate-800 to-slate-900",
  },
  {
    name: "Aurora",
    class: "bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-600",
    preview: "bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-600",
  },
  {
    name: "Golden Hour",
    class: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
    preview: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500",
  },
  { name: "Custom", class: "bg-white", preview: "bg-gradient-to-br from-gray-200 to-gray-300" },
]

const qrTypes = [
  { id: "url", label: "Website URL", icon: Link, placeholder: "https://example.com" },
  { id: "text", label: "Plain Text", icon: MessageSquare, placeholder: "Enter your text here..." },
  { id: "email", label: "Email", icon: Mail, placeholder: "email@example.com" },
  { id: "phone", label: "Phone Number", icon: Phone, placeholder: "+1234567890" },
  { id: "wifi", label: "WiFi Network", icon: Wifi, placeholder: "Network Name" },
  { id: "vcard", label: "Contact Card", icon: User, placeholder: "Contact Information" },
]

interface QRHistory {
  id: string
  type: string
  content: string
  background: string
  timestamp: Date
  qrCode: string
}

export default function QRGeneratorApp() {
  const [activeType, setActiveType] = useState("url")
  const [content, setContent] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [selectedBackground, setSelectedBackground] = useState(backgroundPatterns[0])
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [history, setHistory] = useState<QRHistory[]>([])
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [showHistory, setShowHistory] = useState(false)

  const [qrSize, setQrSize] = useState([400])
  const [qrMargin, setQrMargin] = useState([2])
  const [qrColor, setQrColor] = useState("#000000")
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF")
  const [errorCorrection, setErrorCorrection] = useState("M")

  const [wifiPassword, setWifiPassword] = useState("")
  const [wifiSecurity, setWifiSecurity] = useState("WPA")
  const [wifiHidden, setWifiHidden] = useState(false)

  const [vcardName, setVcardName] = useState("")
  const [vcardPhone, setVcardPhone] = useState("")
  const [vcardEmail, setVcardEmail] = useState("")
  const [vcardOrg, setVcardOrg] = useState("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Restore persisted state on first mount
  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem('zinq:history')
      if (rawHistory) {
        const parsed: QRHistory[] = JSON.parse(rawHistory)
        // revive Date
        parsed.forEach((h: any) => (h.timestamp = new Date(h.timestamp)))
        setHistory(parsed)
      }

      const rawPrefs = localStorage.getItem('zinq:prefs')
      if (rawPrefs) {
        const p = JSON.parse(rawPrefs)
        if (p.activeType) setActiveType(p.activeType)
        if (typeof p.content === 'string') setContent(p.content)
        if (Array.isArray(p.qrSize)) setQrSize(p.qrSize)
        if (Array.isArray(p.qrMargin)) setQrMargin(p.qrMargin)
        if (typeof p.qrColor === 'string') setQrColor(p.qrColor)
        if (typeof p.qrBgColor === 'string') setQrBgColor(p.qrBgColor)
        if (typeof p.errorCorrection === 'string') setErrorCorrection(p.errorCorrection)
        if (typeof p.customBackground === 'string' || p.customBackground === null) setCustomBackground(p.customBackground)
        if (typeof p.selectedBackgroundName === 'string') {
          const found = backgroundPatterns.find((b) => b.name === p.selectedBackgroundName)
          if (found) setSelectedBackground(found)
        }
        if (typeof p.wifiPassword === 'string') setWifiPassword(p.wifiPassword)
        if (typeof p.wifiSecurity === 'string') setWifiSecurity(p.wifiSecurity)
        if (typeof p.wifiHidden === 'boolean') setWifiHidden(p.wifiHidden)
        if (typeof p.vcardName === 'string') setVcardName(p.vcardName)
        if (typeof p.vcardPhone === 'string') setVcardPhone(p.vcardPhone)
        if (typeof p.vcardEmail === 'string') setVcardEmail(p.vcardEmail)
        if (typeof p.vcardOrg === 'string') setVcardOrg(p.vcardOrg)
      }

  const rawFavs = localStorage.getItem('zinq:favs')
  if (rawFavs) setFavorites(JSON.parse(rawFavs))
    } catch {
      // ignore

  // Persist favorites
  useEffect(() => {
    try { localStorage.setItem('zinq:favs', JSON.stringify(favorites)) } catch {}
  }, [favorites])
    }
  }, [])

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('zinq:history', JSON.stringify(history))
    } catch {}
  }, [history])

  // Persist preferences
  useEffect(() => {
    try {
      const prefs = {
        activeType,
        content,
        qrSize,
        qrMargin,
        qrColor,
        qrBgColor,
        errorCorrection,
        selectedBackgroundName: selectedBackground?.name,
        customBackground,
        wifiPassword,
        wifiSecurity,
        wifiHidden,
        vcardName,
        vcardPhone,
        vcardEmail,
        vcardOrg,
      }
      localStorage.setItem('zinq:prefs', JSON.stringify(prefs))
    } catch {}
  }, [activeType, content, qrSize, qrMargin, qrColor, qrBgColor, errorCorrection, selectedBackground, customBackground, wifiPassword, wifiSecurity, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg])

  const generateContent = useCallback(() => {
    switch (activeType) {
      case "url":
        return content.startsWith("http") ? content : `https://${content}`
      case "text":
        return content
      case "email":
        return `mailto:${content}`
      case "phone":
        return `tel:${content}`
      case "wifi":
        return `WIFI:T:${wifiSecurity};S:${content};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`
      case "vcard":
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nORG:${vcardOrg}\nEND:VCARD`
      default:
        return content
    }
  }, [activeType, content, wifiPassword, wifiSecurity, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg])

  const generateQR = async () => {
    const finalContent = generateContent()
    if (!finalContent.trim()) return

    setIsGenerating(true)
    try {
      const qrDataURL = await QRCode.toDataURL(finalContent, {
        width: qrSize[0],
        margin: qrMargin[0],
        errorCorrectionLevel: errorCorrection as any,
        color: {
          dark: qrColor,
          light: qrBgColor,
        },
      })
      setQrCode(qrDataURL)

      const newHistoryItem: QRHistory = {
        id: Date.now().toString(),
        type: activeType,
        content: finalContent,
        background: selectedBackground.name,
        timestamp: new Date(),
        qrCode: qrDataURL,
      }
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]) // Keep last 10
  toast({ title: "Generated", description: "Your QR code is ready." })
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
    setIsGenerating(false)
  }

  const downloadQR = () => {
    if (!qrCode || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const size = qrSize[0]
    canvas.width = size
    canvas.height = size

    // Apply background
    if (selectedBackground.name === "Custom" && customBackground) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, 0, 0, size, size)
        drawQROnCanvas(ctx, size)
        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = `qr-code-${activeType}-${Date.now()}.png`
        link.click()
        toast({ title: "Downloaded", description: "Saved PNG to your device." })
      }
      img.src = customBackground
    } else {
      applyGradientBackground(ctx, size)
      drawQROnCanvas(ctx, size)
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `qr-code-${activeType}-${Date.now()}.png`
      link.click()
      toast({ title: "Downloaded", description: "Saved PNG to your device." })
    }
  }

  // Download as SVG using qrcode's toString API
  const downloadSVG = async () => {
    const finalContent = generateContent()
    if (!finalContent.trim()) return
    try {
      const svg = await QRCode.toString(finalContent, {
        type: "svg",
        width: qrSize[0],
        margin: qrMargin[0],
        errorCorrectionLevel: errorCorrection as any,
      } as any)
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `qr-code-${activeType}-${Date.now()}.svg`
      link.click()
      URL.revokeObjectURL(url)
  toast({ title: "Exported", description: "SVG downloaded." })
    } catch (e) {
      console.error("SVG export failed", e)
    }
  }

  // Copy PNG image to clipboard (if supported)
  const copyImageToClipboard = async () => {
    try {
      if (!qrCode) return
      const res = await fetch(qrCode)
      const blob = await res.blob()
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({ [blob.type]: blob })
        await (navigator.clipboard as any).write([item])
      } else {
        // Fallback: copy content text
        await navigator.clipboard.writeText(generateContent())
      }
  toast({ title: "Copied", description: "QR copied to clipboard." })
    } catch (e) {
      console.error("Copy failed", e)
    }
  }

  const drawQROnCanvas = (ctx: CanvasRenderingContext2D, size: number) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      const qrSize = size * 0.6
      const x = (size - qrSize) / 2
      const y = (size - qrSize) / 2

      // Add white background for QR code
      ctx.fillStyle = qrBgColor
      ctx.fillRect(x - 20, y - 20, qrSize + 40, qrSize + 40)

      ctx.drawImage(img, x, y, qrSize, qrSize)

      // Download
      const link = document.createElement("a")
      link.download = `qr-code-${activeType}-${Date.now()}.png`
      link.href = canvasRef.current!.toDataURL()
      link.click()
    }
    img.src = qrCode
  }

  const applyGradientBackground = (ctx: CanvasRenderingContext2D, size: number) => {
    if (selectedBackground.name === "Clean") {
      ctx.fillStyle = "#ffffff"
    } else {
      const gradient = ctx.createLinearGradient(0, 0, size, size)
      // Apply gradient based on selected background
      switch (selectedBackground.name) {
        case "Emerald Gradient":
          gradient.addColorStop(0, "#34d399")
          gradient.addColorStop(1, "#059669")
          break
        case "Ocean Wave":
          gradient.addColorStop(0, "#60a5fa")
          gradient.addColorStop(0.5, "#06b6d4")
          gradient.addColorStop(1, "#0d9488")
          break
        case "Sunset":
          gradient.addColorStop(0, "#fb923c")
          gradient.addColorStop(0.5, "#ec4899")
          gradient.addColorStop(1, "#9333ea")
          break
        case "Forest":
          gradient.addColorStop(0, "#4ade80")
          gradient.addColorStop(1, "#047857")
          break
        case "Midnight":
          gradient.addColorStop(0, "#1e293b")
          gradient.addColorStop(1, "#0f172a")
          break
        case "Aurora":
          gradient.addColorStop(0, "#a855f7")
          gradient.addColorStop(0.5, "#ec4899")
          gradient.addColorStop(1, "#4f46e5")
          break
        case "Golden Hour":
          gradient.addColorStop(0, "#facc15")
          gradient.addColorStop(0.5, "#f97316")
          gradient.addColorStop(1, "#ef4444")
          break
      }
      ctx.fillStyle = gradient
    }
    ctx.fillRect(0, 0, size, size)
  }

  const handleCustomBackground = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomBackground(e.target?.result as string)
        setSelectedBackground(backgroundPatterns.find((p) => p.name === "Custom")!)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const clearHistory = () => {
    if (confirm('Clear all history?')) {
      setHistory([])
      toast({ title: "History cleared" })
    }
  }

  useEffect(() => {
    const onToggle = () => setShowHistory((v) => !v)
    window.addEventListener('zinq:toggle-history', onToggle as any)
    return () => window.removeEventListener('zinq:toggle-history', onToggle as any)
  }, [])

  // Keyboard shortcuts: Ctrl+Enter generate, H toggle history
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault()
        generateQR()
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault()
        setShowHistory((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [generateQR])

  // Broadcast showHistory changes so other components (Hero) can reflect label state
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('zinq:history-changed', { detail: { showHistory } }))
  }, [showHistory])

  return (
    <div className="min-h-screen bg-background">
      <Hero />

      {/* Features */}
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border p-6 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-up delay-100">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Fast and flexible</h3>
            <p className="text-sm text-muted-foreground mt-1 pretty">Generate high-quality codes instantly with granular controls.</p>
          </div>
          <div className="rounded-xl border p-6 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-up delay-200">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Privacy-first</h3>
            <p className="text-sm text-muted-foreground mt-1 pretty">All generation happens in your browser — nothing uploaded.</p>
          </div>
          <div className="rounded-xl border p-6 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-up delay-300">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Cloud className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Share and export</h3>
            <p className="text-sm text-muted-foreground mt-1 pretty">Download PNGs and reuse recent generations with one click.</p>
          </div>
        </div>
      </section>

      {/* App */}
      <section id="app" className="container mx-auto px-4 pb-14 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Content</CardTitle>
                <CardDescription>Choose the type of content for your QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeType} onValueChange={setActiveType} className="w-full">
                  <TabsList className="grid grid-cols-3 lg:grid-cols-6 mb-6">
                    {qrTypes.map((type) => (
                      <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1">
                        <type.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{type.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {qrTypes.map((type) => (
                    <TabsContent key={type.id} value={type.id} className="space-y-4">
                      {type.id === "wifi" ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="wifi-name">Network Name (SSID)</Label>
                            <Input
                              id="wifi-name"
                              placeholder="My WiFi Network"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="wifi-password">Password</Label>
                            <Input
                              id="wifi-password"
                              type="password"
                              placeholder="WiFi Password"
                              value={wifiPassword}
                              onChange={(e) => setWifiPassword(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="wifi-security">Security Type</Label>
                            <Select value={wifiSecurity} onValueChange={setWifiSecurity}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                                <SelectItem value="WEP">WEP</SelectItem>
                                <SelectItem value="nopass">Open Network</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="wifi-hidden" checked={wifiHidden} onCheckedChange={setWifiHidden} />
                            <Label htmlFor="wifi-hidden">Hidden Network</Label>
                          </div>
                        </div>
                      ) : type.id === "vcard" ? (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="vcard-name">Full Name</Label>
                            <Input
                              id="vcard-name"
                              placeholder="John Doe"
                              value={vcardName}
                              onChange={(e) => setVcardName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vcard-phone">Phone Number</Label>
                            <Input
                              id="vcard-phone"
                              placeholder="+1234567890"
                              value={vcardPhone}
                              onChange={(e) => setVcardPhone(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vcard-email">Email</Label>
                            <Input
                              id="vcard-email"
                              type="email"
                              placeholder="john@example.com"
                              value={vcardEmail}
                              onChange={(e) => setVcardEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="vcard-org">Organization</Label>
                            <Input
                              id="vcard-org"
                              placeholder="Company Name"
                              value={vcardOrg}
                              onChange={(e) => setVcardOrg(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : type.id === "text" ? (
                        <div>
                          <Label htmlFor="text-content">Text Content</Label>
                          <Textarea
                            id="text-content"
                            placeholder={type.placeholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                          />
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="content">{type.label}</Label>
                          <Input
                            id="content"
                            type={type.id === "email" ? "email" : type.id === "phone" ? "tel" : "text"}
                            placeholder={type.placeholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                          />
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>

                <Button
                  onClick={generateQR}
                  disabled={!content.trim() || isGenerating}
                  className="w-full mt-6"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Advanced Options
                </CardTitle>
                <CardDescription>Customize your QR code appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Size: {qrSize[0]}px</Label>
                    <Slider value={qrSize} onValueChange={setQrSize} max={800} min={200} step={50} className="mt-2" />
                  </div>
                  <div>
                    <Label>Margin: {qrMargin[0]}</Label>
                    <Slider value={qrMargin} onValueChange={setQrMargin} max={10} min={0} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="qr-color">Foreground Color</Label>
                    <Input
                      id="qr-color"
                      type="color"
                      value={qrColor}
                      onChange={(e) => setQrColor(e.target.value)}
                      className="h-10 mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="qr-bg-color">Background Color</Label>
                    <Input
                      id="qr-bg-color"
                      type="color"
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="h-10 mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="error-correction">Error Correction Level</Label>
                  <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:sticky lg:top-20 self-start">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Background Style
                </CardTitle>
                <CardDescription>Choose or upload a custom background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {backgroundPatterns.map((pattern) => (
                    <button
                      key={pattern.name}
                      onClick={() => setSelectedBackground(pattern)}
                      className={`relative h-16 rounded-lg border-2 transition-all ${
                        selectedBackground.name === pattern.name
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`w-full h-full rounded-md ${pattern.preview}`}>
                        {pattern.name === "Custom" && customBackground && (
                          <img
                            src={customBackground || "/placeholder.svg"}
                            alt="Custom background"
                            className="w-full h-full object-cover rounded-md"
                          />
                        )}
                      </div>
                      <Badge
                        variant={selectedBackground.name === pattern.name ? "default" : "secondary"}
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs"
                      >
                        {pattern.name}
                      </Badge>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Custom Background
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBackground}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {qrCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Your generated QR code</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center space-y-4">
                    <div className={`p-6 rounded-xl ${selectedBackground.class} shadow-lg`}>
                      {selectedBackground.name === "Custom" && customBackground ? (
                        <div
                          className="p-6 rounded-lg shadow-inner"
                          style={{
                            backgroundImage: `url(${customBackground})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="bg-white p-4 rounded-lg shadow-inner">
                            <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="w-32 h-32" />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white p-4 rounded-lg shadow-inner">
                          <img src={qrCode || "/placeholder.svg"} alt="Generated QR Code" className="w-32 h-32" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={downloadQR} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadSVG}>
                        <Download className="h-4 w-4 mr-2" />
                        SVG
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateContent())}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Content
                      </Button>
                      <Button variant="ghost" size="sm" onClick={copyImageToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Image
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {showHistory && history.length > 0 && (
          <Card className="mt-8 container mx-auto max-w-6xl px-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent QR Codes
              </CardTitle>
              <CardDescription>Your last {history.length} generated QR codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-muted-foreground">Click a star to favorite</div>
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  <Trash2 className="h-4 w-4 mr-2" /> Clear all
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {history.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{item.type.toUpperCase()}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{item.timestamp.toLocaleDateString()}</span>
                        <button
                          className={`text-sm ${favorites[item.id] ? 'text-primary' : 'text-muted-foreground'} hover:text-primary`}
                          onClick={() => setFavorites((f) => ({ ...f, [item.id]: !f[item.id] }))}
                          title={favorites[item.id] ? 'Unfavorite' : 'Favorite'}
                        >
                          {favorites[item.id] ? '★' : '☆'}
                        </button>
                      </div>
                    </div>
                    <img src={item.qrCode || "/placeholder.svg"} alt="QR Code" className="w-20 h-20 mx-auto" />
                    <p className="text-sm text-muted-foreground truncate">{item.content}</p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(item.content)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const link = document.createElement("a")
                          link.download = `qr-${item.type}-${item.id}.png`
                          link.href = item.qrCode
                          link.click()
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                          try {
                            const svg = await QRCode.toString(item.content, { type: 'svg', width: 400, margin: 2 } as any)
                            const blob = new Blob([svg], { type: 'image/svg+xml' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `qr-${item.type}-${item.id}.svg`
                            a.click()
                            URL.revokeObjectURL(url)
                          } catch (e) { console.error(e) }
                        }}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Hidden canvas for download */}
        <canvas ref={canvasRef} className="hidden" />
      </section>
    </div>
  )
}
