"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    // detect standalone display mode (iOS & others)
    const media = window.matchMedia('(display-mode: standalone)')
    setIsStandalone(media.matches || (window as any).navigator.standalone === true)
    const onChange = () => setIsStandalone(media.matches)
    media.addEventListener?.('change', onChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener?.('change', onChange)
    }
  }, [])

  // Hide if already installed
  if (installed || isStandalone) return null

  const available = !!deferred

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1"
      title={available ? 'Install this app' : 'Use your browser menu to install (e.g., Chrome: Install App)'}
      onClick={async () => {
        if (deferred) {
          await deferred.prompt()
          setDeferred(null)
        } else {
          // Simple fallback hint when prompt isn’t available yet
          alert('Install via your browser menu:\n• Chrome/Edge: Menu → Install App\n• iOS Safari: Share → Add to Home Screen')
        }
      }}
      disabled={!available}
    >
      <Download className="h-4 w-4" /> Install
    </Button>
  )
}
