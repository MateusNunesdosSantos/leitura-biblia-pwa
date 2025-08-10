import Database from 'better-sqlite3'
import path from 'path'

export interface ProgressRecord {
  id: number
  book_id: string
  chapter_index: number
  is_read: boolean
  created_at: string
  updated_at: string
}

export type ProgressMap = Record<string, boolean[]>

class DatabaseManager {
  private db: Database.Database

  constructor() {
    // Criar banco na pasta do projeto
    const dbPath = path.join(process.cwd(), 'bible-progress.db')
    this.db = new Database(dbPath)
    this.initializeDatabase()
  }

  private initializeDatabase() {
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

  // Salvar progresso de um capítulo
  saveChapterProgress(bookId: string, chapterIndex: number, isRead: boolean): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO progress (book_id, chapter_index, is_read, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `)
    stmt.run(bookId, chapterIndex, isRead ? 1 : 0)
  }

  // Carregar progresso de todos os livros
  loadAllProgress(): ProgressMap {
    const stmt = this.db.prepare(`
      SELECT book_id, chapter_index, is_read
      FROM progress
      WHERE is_read = 1
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

  // Carregar progresso de um livro específico
  loadBookProgress(bookId: string): boolean[] {
    const stmt = this.db.prepare(`
      SELECT chapter_index, is_read
      FROM progress
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

  // Resetar todo o progresso
  resetAllProgress(): void {
    this.db.exec('DELETE FROM progress')
  }

  // Resetar progresso de um livro específico
  resetBookProgress(bookId: string): void {
    const stmt = this.db.prepare('DELETE FROM progress WHERE book_id = ?')
    stmt.run(bookId)
  }

  // Obter estatísticas gerais
  getStats() {
    const totalChaptersRead = this.db.prepare(`
      SELECT COUNT(*) as count FROM progress WHERE is_read = 1
    `).get() as { count: number }

    const totalBooks = this.db.prepare(`
      SELECT COUNT(DISTINCT book_id) as count FROM progress WHERE is_read = 1
    `).get() as { count: number }

    return {
      totalChaptersRead: totalChaptersRead.count,
      booksStarted: totalBooks.count
    }
  }

  // Fechar conexão com o banco
  close(): void {
    this.db.close()
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