"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BIBLE_BOOKS } from '@/lib/bible-data'
import { loadProgress, saveProgress, type ProgressMap } from '@/lib/storage'
import { ArrowLeft, Check } from 'lucide-react'
import { ProgressBar } from '@/components/ProgressBar'

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  const [books, setBooks] = useState<ProgressMap>({})

  const book = BIBLE_BOOKS.find(b => b.id === bookId)

  useEffect(() => {
    async function loadData() {
      try {
        const progress = await loadProgress()
        setBooks(progress.books)
      } catch (error) {
        console.error('Erro ao carregar progresso:', error)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (Object.keys(books).length > 0) {
      saveProgress({ books }).catch(error => {
        console.error('Erro ao salvar progresso:', error)
      })
    }
  }, [books])

  if (!book) {
    return (
      <main className="py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Livro não encontrado</h1>
          <button 
            onClick={() => router.push('/')}
            className="btn btn-primary"
          >
            Voltar ao início
          </button>
        </div>
      </main>
    )
  }

  const readChapters = books[bookId]?.filter(Boolean).length ?? 0
  const progress = book.chapters ? (readChapters / book.chapters) * 100 : 0

  function toggleChapter(index: number) {
    setBooks((prev) => {
      const arr = prev[bookId] ? [...prev[bookId]] : []
      arr[index] = !arr[index]
      return { ...prev, [bookId]: arr }
    })
  }

  return (
    <main className="py-6">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/')}
          className="btn btn-secondary mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </button>
        
        <div className="card p-6">
          <h1 className="text-2xl font-bold mb-4">{book.name}</h1>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted">Progresso</span>
              <span className="badge">{progress.toFixed(1)}%</span>
            </div>
            <ProgressBar value={progress / 100} />
          </div>
          <p className="text-muted">
            {readChapters} de {book.chapters} capítulos lidos
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Capítulos</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {Array.from({ length: book.chapters }, (_, i) => {
            const isRead = books[bookId]?.[i] ?? false
            return (
              <button
                key={i}
                onClick={() => toggleChapter(i)}
                className={`
                  aspect-square rounded-lg border-2 transition-all duration-200 flex items-center justify-center text-sm font-medium
                  ${isRead 
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white' 
                    : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--hover)]'
                  }
                `}
              >
                {isRead ? <Check size={16} /> : i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}