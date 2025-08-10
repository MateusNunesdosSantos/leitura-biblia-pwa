// Sistema de armazenamento híbrido para PWA
// Funciona tanto localmente quanto na Vercel

export type ProgressMap = Record<string, boolean[]>

const STORAGE_KEY = 'bible-reading-progress'

export class ClientStorageManager {
  private static instance: ClientStorageManager
  private isClient: boolean

  private constructor() {
    this.isClient = typeof window !== 'undefined'
  }

  static getInstance(): ClientStorageManager {
    if (!ClientStorageManager.instance) {
      ClientStorageManager.instance = new ClientStorageManager()
    }
    return ClientStorageManager.instance
  }

  // Salvar progresso no localStorage
  saveProgress(progress: ProgressMap): void {
    if (!this.isClient) return
    
    try {
      const data = {
        progress,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  // Carregar progresso do localStorage
  loadProgress(): ProgressMap {
    if (!this.isClient) return {}
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return {}
      
      const data = JSON.parse(stored)
      return data.progress || {}
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error)
      // Limpar dados corrompidos
      localStorage.removeItem(STORAGE_KEY)
      return {}
    }
  }

  // Salvar progresso de um capítulo específico
  saveChapterProgress(bookId: string, chapterIndex: number, isRead: boolean): void {
    if (!this.isClient) return
    
    const currentProgress = this.loadProgress()
    
    // Garantir que o array do livro existe
    if (!currentProgress[bookId]) {
      currentProgress[bookId] = []
    }
    
    // Garantir que o array tem o tamanho necessário
    while (currentProgress[bookId].length <= chapterIndex) {
      currentProgress[bookId].push(false)
    }
    
    // Definir o valor do capítulo
    currentProgress[bookId][chapterIndex] = isRead
    
    // Salvar imediatamente
    this.saveProgress(currentProgress)
  }

  // Carregar progresso de um livro específico
  loadBookProgress(bookId: string): boolean[] {
    const progress = this.loadProgress()
    return progress[bookId] || []
  }

  // Resetar todo o progresso
  resetAllProgress(): void {
    if (!this.isClient) return
    
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Erro ao resetar localStorage:', error)
    }
  }

  // Resetar progresso de um livro
  resetBookProgress(bookId: string): void {
    const currentProgress = this.loadProgress()
    delete currentProgress[bookId]
    this.saveProgress(currentProgress)
  }

  // Obter estatísticas
  getStats() {
    const progress = this.loadProgress()
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
  }

  // Sincronizar com servidor (quando disponível)
  async syncWithServer(progress: ProgressMap): Promise<boolean> {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ books: progress })
      })
      
      return response.ok
    } catch (error) {
      console.error('Erro ao sincronizar com servidor:', error)
      return false
    }
  }

  // Carregar do servidor (quando disponível)
  async loadFromServer(): Promise<ProgressMap> {
    try {
      const response = await fetch('/api/progress')
      if (!response.ok) throw new Error('Falha ao carregar do servidor')
      
      const data = await response.json()
      return data.books || {}
    } catch (error) {
      console.error('Erro ao carregar do servidor:', error)
      return {}
    }
  }
}

// Instância singleton
export const clientStorage = ClientStorageManager.getInstance()