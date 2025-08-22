import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { ServiceWorkerRegister } from '@/components/pwa/sw-register'
import { ThemeFromImage } from '@/components/theme-from-image'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'Zinq',
  description: 'A QR code generator with advanced features',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1f' },
  ],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/placeholder-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
        <link rel="preload" as="image" href="/mascot.png" />
      </head>
  <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeFromImage />
          <Navbar />
          {children}
          <ServiceWorkerRegister />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
