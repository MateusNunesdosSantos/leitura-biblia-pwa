'use client'
import React from 'react'
import { BookOpen, RefreshCcw, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function Header({ onReset }: { onReset: () => void }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/5">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-lg font-semibold">Leitura da Bíblia Católica</h1>
            <p className="text-xs text-muted">Marque os capítulos lidos e acompanhe seu progresso</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            title="Zerar progresso"
          >
            <RefreshCcw className="h-4 w-4" />
            Zerar
          </button>
        </div>
      </div>
    </header>
  )
}