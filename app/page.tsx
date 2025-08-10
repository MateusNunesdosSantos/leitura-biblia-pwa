"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { BIBLE_BOOKS, getTestamentBooks, getTotalChapters, getTotalChaptersByTestament } from '@/lib/bible-data'
import { loadProgress, saveProgress, resetProgress, type ProgressMap } from '@/lib/storage'
import { Header } from '@/components/Header'
import { BookCard } from '@/components/BookCard'
import { ProgressBar } from '@/components/ProgressBar'

export default function HomePage() {
  const [tab, setTab] = useState<'old' | 'new'>('old')
  const [books, setBooks] = useState<ProgressMap>({})
  const [searchTerm, setSearchTerm] = useState('')

  // carregar progresso da API
  useEffect(() => {
    async function loadData() {
      try {
        const state = await loadProgress()
        setBooks(state.books)
      } catch (error) {
        console.error('Erro ao carregar progresso:', error)
      }
    }
    loadData()
  }, [])

  // salvar progresso quando mudar
  useEffect(() => {
    if (Object.keys(books).length > 0) {
      saveProgress({ books }).catch(error => {
        console.error('Erro ao salvar progresso:', error)
      })
    }
  }, [books])

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

  function toggleChapter(bookId: string, index: number) {
    setBooks((prev) => {
      const arr = prev[bookId] ? [...prev[bookId]] : []
      arr[index] = !arr[index]
      return { ...prev, [bookId]: arr }
    })
  }

  async function handleReset() {
    try {
      await resetProgress()
      setBooks({})
    } catch (error) {
      console.error('Erro ao resetar progresso:', error)
    }
  }

  return (
    <main className="py-3 sm:py-6">
      <Header onReset={handleReset} />

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