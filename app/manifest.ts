import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zinq — QR Generator',
    short_name: 'Zinq',
    description: 'Generate, style, and export QR codes offline.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0f1f',
    theme_color: '#00bcd4',
    categories: ['utilities', 'productivity'],
    icons: [
      {
  src: '/placeholder-logo.png',
  sizes: '192x192',
  type: 'image/png',
  purpose: 'maskable',
      },
      {
  src: '/placeholder-logo.png',
  sizes: '512x512',
  type: 'image/png',
  purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'New QR',
        url: '/#app',
        description: 'Jump to the generator',
      },
    ],
    prefer_related_applications: false,
  }
}
