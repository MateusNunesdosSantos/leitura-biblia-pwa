"use client"
import React, { useMemo, useState } from 'react'
import { BIBLE_BOOKS, getTestamentBooks, getTotalChapters, getTotalChaptersByTestament } from '@/lib/bible-data'
import { useProgress } from '@/hooks/useProgress'
import { Header } from '@/components/Header'
import { BookCard } from '@/components/BookCard'
import { ProgressBar } from '@/components/ProgressBar'

export default function HomePage() {
  const [tab, setTab] = useState<'old' | 'new'>('old')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Usar o novo hook de progresso
  const { 
    progress: books, 
    isLoading, 
    isServerless, 
    saveChapterProgress, 
    resetAllProgress 
  } = useProgress()

  const allTotal = useMemo(() => getTotalChapters(), [])

  const allRead = useMemo(() => {
    return BIBLE_BOOKS.reduce((sum, b) => sum + (books[b.id]?.filter(Boolean).length ?? 0), 0)
  }, [books])

  const overallPct = allTotal ? allRead / allTotal : 0

  const shownBooks = useMemo(() => {
    const testamentBooks = getTestamentBooks(tab)
    if (!searchTerm) return testamentBooks
    return testamentBooks.filter(book => 
      book.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tab, searchTerm])

  const shownTotals = useMemo(() => {
    const total = getTotalChaptersByTestament(tab)
    const read = shownBooks.reduce((sum, b) => sum + (books[b.id]?.filter(Boolean).length ?? 0), 0)
    return { total, read, pct: total ? read / total : 0 }
  }, [tab, books, shownBooks])

  async function toggleChapter(bookId: string, index: number) {
    const currentChapters = books[bookId] || []
    const newValue = !currentChapters[index]
    await saveChapterProgress(bookId, index, newValue)
  }

  async function handleReset() {
    try {
      await resetAllProgress()
    } catch (error) {
      console.error('Erro ao resetar progresso:', error)
    }
  }

  if (isLoading) {
    return (
      <main className="py-3 sm:py-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)] mx-auto mb-2"></div>
            <p className="text-[var(--text-secondary)]">Carregando progresso...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-3 sm:py-6">
      <Header onReset={handleReset} />
      
      {isServerless && (
        <div className="card p-3 mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">ℹ️</span>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Modo offline ativo - Seus dados estão sendo salvos localmente no dispositivo.
            </p>
          </div>
        </div>
      )}

      <section className="card p-4 mb-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-semibold mb-1">Progresso Geral</h2>
            <p className="text-sm text-muted">{(overallPct * 100).toFixed(1)}% concluído</p>
          </div>
          <div className="min-w-[180px] w-full sm:w-64">
            <ProgressBar value={overallPct} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setTab('old')} className={`btn flex-1 ${tab==='old' ? 'btn-primary' : 'btn-secondary'}`}>Antigo Testamento</button>
        <button onClick={() => setTab('new')} className={`btn flex-1 ${tab==='new' ? 'btn-primary' : 'btn-secondary'}`}>Novo Testamento</button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Pesquisar livros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-6">
        {shownBooks.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            name={book.name}
            chapters={book.chapters}
            checked={books[book.id] ?? []}
            onToggle={(i) => toggleChapter(book.id, i)}
          />
        ))}
      </section>

      <footer className="pb-6 text-center text-xs text-muted">
        Feito com ❤️ para ajudar na sua jornada de leitura.
      </footer>
    </main>
  )
}