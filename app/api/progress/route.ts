import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function GET() {
  try {
    const db = getDatabase()
    const progress = db.loadAllProgress()
    return NextResponse.json({ books: progress })
  } catch (error) {
    console.error('Erro ao carregar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar progresso' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { books } = body
    
    if (!books || typeof books !== 'object') {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    const db = getDatabase()
    
    // Salvar cada capítulo individualmente
    for (const [bookId, chapters] of Object.entries(books)) {
      if (Array.isArray(chapters)) {
        chapters.forEach((isRead, index) => {
          if (typeof isRead === 'boolean') {
            db.saveChapterProgress(bookId, index, isRead)
          }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar progresso' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const db = getDatabase()
    db.resetAllProgress()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao resetar progresso:', error)
    return NextResponse.json(
      { error: 'Erro ao resetar progresso' },
      { status: 500 }
    )
  }
}