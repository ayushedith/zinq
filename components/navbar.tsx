"use client"

import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { InstallButton } from "@/components/pwa/install-button"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-md" />
          <Image src="/txt.png" alt="QR Code" width={64} height={32} className="rounded-md" />
        </Link>
        <nav className="flex items-center gap-2">
          <InstallButton />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground" aria-label="Help">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Help & Shortcuts</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Ctrl + Enter: Generate QR</p>
                <p>• H: Toggle history</p>
                <p>• Use the Install button to add Zinq to your home screen.</p>
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
