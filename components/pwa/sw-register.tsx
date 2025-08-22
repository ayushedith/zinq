"use client"

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('SW registration failed', err)
        }
      }
      register()
    }
  }, [])
  return null
}
