import './tailwind.css'
import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PWAInstaller } from '@/components/PWAInstaller'

export const metadata: Metadata = {
  title: 'Leitura da Bíblia Católica',
  description: 'Acompanhe sua leitura da Bíblia Católica com progresso por livro e geral.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bíblia Católica'
  },
  icons: {
    icon: '/icon-192x192.svg',
    apple: '/icon-192x192.svg'
  }
}

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="container-app mx-auto px-3 sm:px-4">
            {children}
          </div>
          <PWAInstaller />
        </ThemeProvider>
      </body>
    </html>
  )
}