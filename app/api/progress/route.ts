import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/database'

export async function GET() {
  try {
    const db = getDatabase()
    const progress = db.loadAllProgress()
    return NextResponse.json({ 
      books: progress,
      serverless: process.env.VERCEL ? true : false
    })
  } catch (error) {
    console.error('Erro ao carregar progresso:', error)
    // Em caso de erro, retornar estrutura vazia para o cliente usar localStorage
    return NextResponse.json({ 
      books: {},
      serverless: true,
      error: 'Usando armazenamento local'
    })
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

    return NextResponse.json({ 
      success: true,
      serverless: process.env.VERCEL ? true : false
    })
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    // Em ambiente serverless, aceitar o erro e deixar o cliente usar localStorage
    return NextResponse.json({ 
      success: false,
      serverless: true,
      error: 'Dados salvos localmente'
    })
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