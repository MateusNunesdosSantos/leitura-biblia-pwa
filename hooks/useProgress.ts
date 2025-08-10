'use client'

import { useState, useEffect, useCallback } from 'react'
import { clientStorage, ProgressMap } from '@/lib/client-storage'

export interface UseProgressReturn {
  progress: ProgressMap
  isLoading: boolean
  isServerless: boolean
  saveChapterProgress: (bookId: string, chapterIndex: number, isRead: boolean) => Promise<void>
  loadBookProgress: (bookId: string) => boolean[]
  resetAllProgress: () => Promise<void>
  resetBookProgress: (bookId: string) => Promise<void>
  getStats: () => { totalChapters: number; readChapters: number; percentage: number }
  syncProgress: () => Promise<void>
}

export function useProgress(): UseProgressReturn {
  const [progress, setProgress] = useState<ProgressMap>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isServerless, setIsServerless] = useState(false)

  // Carregar progresso inicial
  useEffect(() => {
    loadInitialProgress()
  }, [])

  const loadInitialProgress = async () => {
    setIsLoading(true)
    
    try {
      // Tentar carregar do servidor primeiro
      const response = await fetch('/api/progress')
      
      if (response.ok) {
        const data = await response.json()
        setIsServerless(data.serverless || false)
        
        if (data.books && Object.keys(data.books).length > 0) {
          // Se há dados no servidor, usar eles
          setProgress(data.books)
          // Sincronizar com localStorage
          clientStorage.saveProgress(data.books)
        } else {
          // Se não há dados no servidor, carregar do localStorage
          const localProgress = clientStorage.loadProgress()
          setProgress(localProgress)
        }
      } else {
        // Se falhou no servidor, usar localStorage
        setIsServerless(true)
        const localProgress = clientStorage.loadProgress()
        setProgress(localProgress)
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error)
      // Em caso de erro, usar localStorage
      setIsServerless(true)
      const localProgress = clientStorage.loadProgress()
      setProgress(localProgress)
    } finally {
      setIsLoading(false)
    }
  }

  const saveChapterProgress = useCallback(async (bookId: string, chapterIndex: number, isRead: boolean) => {
    // Atualizar estado local imediatamente
    setProgress(prev => {
      const newProgress = { ...prev }
      if (!newProgress[bookId]) {
        newProgress[bookId] = []
      }
      newProgress[bookId][chapterIndex] = isRead
      return newProgress
    })

    // Salvar no localStorage
    clientStorage.saveChapterProgress(bookId, chapterIndex, isRead)

    // Tentar sincronizar com servidor (se não for serverless)
    if (!isServerless) {
      try {
        const currentProgress = clientStorage.loadProgress()
        await clientStorage.syncWithServer(currentProgress)
      } catch (error) {
        console.warn('Falha ao sincronizar com servidor, dados salvos localmente:', error)
      }
    }
  }, [isServerless])

  const loadBookProgress = useCallback((bookId: string): boolean[] => {
    return progress[bookId] || []
  }, [progress])

  const resetAllProgress = useCallback(async () => {
    // Resetar estado local
    setProgress({})
    
    // Resetar localStorage
    clientStorage.resetAllProgress()

    // Tentar resetar no servidor
    if (!isServerless) {
      try {
        await fetch('/api/progress', { method: 'DELETE' })
      } catch (error) {
        console.warn('Falha ao resetar no servidor:', error)
      }
    }
  }, [isServerless])

  const resetBookProgress = useCallback(async (bookId: string) => {
    // Atualizar estado local
    setProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[bookId]
      return newProgress
    })

    // Resetar no localStorage
    clientStorage.resetBookProgress(bookId)

    // Tentar sincronizar com servidor
    if (!isServerless) {
      try {
        const currentProgress = clientStorage.loadProgress()
        await clientStorage.syncWithServer(currentProgress)
      } catch (error) {
        console.warn('Falha ao sincronizar com servidor:', error)
      }
    }
  }, [isServerless])

  const getStats = useCallback(() => {
    let totalChapters = 0
    let readChapters = 0
    
    for (const bookId in progress) {
      const chapters = progress[bookId]
      totalChapters += chapters.length
      readChapters += chapters.filter(Boolean).length
    }
    
    return {
      totalChapters,
      readChapters,
      percentage: totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0
    }
  }, [progress])

  const syncProgress = useCallback(async () => {
    if (isServerless) return
    
    try {
      const localProgress = clientStorage.loadProgress()
      const success = await clientStorage.syncWithServer(localProgress)
      
      if (success) {
        console.log('Progresso sincronizado com sucesso')
      }
    } catch (error) {
      console.error('Erro ao sincronizar progresso:', error)
    }
  }, [isServerless])

  return {
    progress,
    isLoading,
    isServerless,
    saveChapterProgress,
    loadBookProgress,
    resetAllProgress,
    resetBookProgress,
    getStats,
    syncProgress
  }
}