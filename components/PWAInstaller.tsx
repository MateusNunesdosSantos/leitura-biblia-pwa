"use client"
import { useEffect, useState } from 'react'

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      setShowInstallButton(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm">Instalar App</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Adicione à tela inicial para acesso rápido
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstallButton(false)}
              className="px-3 py-1 text-xs rounded border border-[var(--border)] hover:bg-[var(--hover)] transition-colors"
            >
              Agora não
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3 py-1 text-xs rounded bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}