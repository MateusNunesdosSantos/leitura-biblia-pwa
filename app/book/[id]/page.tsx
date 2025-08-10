"use client"
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BIBLE_BOOKS } from '@/lib/bible-data'
import { useProgress } from '@/hooks/useProgress'
import { ArrowLeft, Check } from 'lucide-react'
import { ProgressBar } from '@/components/ProgressBar'

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.id as string
  
  const { 
    progress: books, 
    isLoading, 
    isServerless, 
    saveChapterProgress 
  } = useProgress()

  const book = BIBLE_BOOKS.find(b => b.id === bookId)

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

  async function toggleChapter(index: number) {
    const currentChapters = books[bookId] || []
    const newValue = !currentChapters[index]
    await saveChapterProgress(bookId, index, newValue)
  }

  if (isLoading) {
    return (
      <main className="py-6">
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
    <main className="py-6">
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