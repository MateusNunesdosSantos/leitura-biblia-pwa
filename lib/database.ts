import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

export interface ProgressRecord {
  id: number
  book_id: string
  chapter_index: number
  is_read: boolean
  created_at: string
  updated_at: string
}

export type ProgressMap = Record<string, boolean[]>

// Detectar se está rodando na Vercel ou ambiente serverless
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || !fs.existsSync

class DatabaseManager {
  private db: Database.Database | null = null
  private memoryStorage: ProgressMap = {}
  private isMemoryMode: boolean = false

  constructor() {
    try {
      if (isServerless) {
        console.log('Ambiente serverless detectado, usando armazenamento em memória')
        this.isMemoryMode = true
        this.loadFromMemory()
      } else {
        // Criar banco na pasta do projeto
        const dbPath = path.join(process.cwd(), 'bible-progress.db')
        this.db = new Database(dbPath)
        this.initializeDatabase()
      }
    } catch (error) {
      console.warn('Erro ao inicializar SQLite, usando modo memória:', error)
      this.isMemoryMode = true
      this.loadFromMemory()
    }
  }

  private initializeDatabase() {
    if (!this.db) return
    
    // Criar tabela de progresso se não existir
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id TEXT NOT NULL,
        chapter_index INTEGER NOT NULL,
        is_read BOOLEAN NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(book_id, chapter_index)
      )
    `)

    // Criar índice para melhor performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_book_chapter ON progress(book_id, chapter_index)
    `)
  }

  private loadFromMemory() {
    // Em ambiente serverless, inicializar com estrutura vazia
    this.memoryStorage = {}
  }

  private saveToMemory() {
    // Em ambiente serverless, os dados ficam apenas na memória durante a execução
    // Para persistência real, seria necessário usar um banco de dados externo
  }

  // Salvar progresso de um capítulo
  saveChapterProgress(bookId: string, chapterIndex: number, isRead: boolean): void {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      if (!this.memoryStorage[bookId]) {
        this.memoryStorage[bookId] = []
      }
      this.memoryStorage[bookId][chapterIndex] = isRead
      this.saveToMemory()
    } else if (this.db) {
      // Modo SQLite para ambiente local
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO progress (book_id, chapter_index, is_read, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `)
      stmt.run(bookId, chapterIndex, isRead ? 1 : 0)
    }
  }

  // Carregar progresso de todos os livros
  loadAllProgress(): ProgressMap {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      return { ...this.memoryStorage }
    } else if (this.db) {
      // Modo SQLite para ambiente local
      const stmt = this.db.prepare(`
        SELECT book_id, chapter_index, is_read
        FROM progress
        ORDER BY book_id, chapter_index
      `)
      
      const rows = stmt.all() as Array<{
        book_id: string
        chapter_index: number
        is_read: number
      }>

      const progressMap: ProgressMap = {}
      
      for (const row of rows) {
        if (!progressMap[row.book_id]) {
          progressMap[row.book_id] = []
        }
        progressMap[row.book_id][row.chapter_index] = Boolean(row.is_read)
      }

      return progressMap
    }
    
    return {}
  }

  // Carregar progresso de um livro específico
  loadBookProgress(bookId: string): boolean[] {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      return this.memoryStorage[bookId] || []
    } else if (this.db) {
      // Modo SQLite para ambiente local
      const stmt = this.db.prepare(`
        SELECT chapter_index, is_read FROM progress
        WHERE book_id = ?
        ORDER BY chapter_index
      `)
      const rows = stmt.all(bookId) as Array<{
        chapter_index: number
        is_read: number
      }>
      
      const chapters: boolean[] = []
      for (const row of rows) {
        chapters[row.chapter_index] = Boolean(row.is_read)
      }
      
      return chapters
    }
    
    return []
  }

  // Resetar todo o progresso
  resetAllProgress(): void {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      this.memoryStorage = {}
      this.saveToMemory()
    } else if (this.db) {
      // Modo SQLite para ambiente local
      this.db.exec('DELETE FROM progress')
    }
  }

  // Resetar progresso de um livro
  resetBookProgress(bookId: string): void {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      delete this.memoryStorage[bookId]
      this.saveToMemory()
    } else if (this.db) {
      // Modo SQLite para ambiente local
      const stmt = this.db.prepare('DELETE FROM progress WHERE book_id = ?')
      stmt.run(bookId)
    }
  }

  // Obter estatísticas gerais
  getStats() {
    if (this.isMemoryMode) {
      // Modo memória para ambiente serverless
      let totalChapters = 0
      let readChapters = 0
      
      for (const bookId in this.memoryStorage) {
        const chapters = this.memoryStorage[bookId]
        totalChapters += chapters.length
        readChapters += chapters.filter(Boolean).length
      }
      
      return {
        totalChapters,
        readChapters,
        percentage: totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0
      }
    } else if (this.db) {
      // Modo SQLite para ambiente local
      const totalChaptersStmt = this.db.prepare('SELECT COUNT(*) as total FROM progress')
      const readChaptersStmt = this.db.prepare('SELECT COUNT(*) as read FROM progress WHERE is_read = 1')
      
      const totalChapters = (totalChaptersStmt.get() as { total: number }).total
      const readChapters = (readChaptersStmt.get() as { read: number }).read
      
      return {
        totalChapters,
        readChapters,
        percentage: totalChapters > 0 ? Math.round((readChapters / totalChapters) * 100) : 0
      }
    }
    
    return { totalChapters: 0, readChapters: 0, percentage: 0 }
  }

  // Fechar conexão com o banco
  close(): void {
    if (this.db) {
      this.db.close()
    }
  }
}

// Instância singleton do banco
let dbInstance: DatabaseManager | null = null

export function getDatabase(): DatabaseManager {
  if (!dbInstance) {
    dbInstance = new DatabaseManager()
  }
  return dbInstance
}

// Funções de conveniência para manter compatibilidade
export function loadProgress(): { books: ProgressMap } {
  const db = getDatabase()
  return { books: db.loadAllProgress() }
}

export function saveProgress(progress: { books: ProgressMap }): void {
  const db = getDatabase()
  
  // Salvar cada capítulo individualmente
  for (const [bookId, chapters] of Object.entries(progress.books)) {
    chapters.forEach((isRead, index) => {
      if (isRead !== undefined) {
        db.saveChapterProgress(bookId, index, isRead)
      }
    })
  }
}

export function resetProgress(): void {
  const db = getDatabase()
  db.resetAllProgress()
}

// ProgressMap já exportado no topo do arquivo