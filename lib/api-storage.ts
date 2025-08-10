export type ProgressMap = Record<string, boolean[]>

export interface ProgressState {
  books: ProgressMap
}

// Carregar progresso da API
export async function loadProgress(): Promise<ProgressState> {
  try {
    const response = await fetch('/api/progress')
    if (!response.ok) {
      throw new Error('Falha ao carregar progresso')
    }
    const data = await response.json()
    return data as ProgressState
  } catch (error) {
    console.error('Erro ao carregar progresso:', error)
    return { books: {} }
  }
}

// Salvar progresso na API
export async function saveProgress(progress: ProgressState): Promise<void> {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progress),
    })
    
    if (!response.ok) {
      throw new Error('Falha ao salvar progresso')
    }
  } catch (error) {
    console.error('Erro ao salvar progresso:', error)
    throw error
  }
}

// Resetar progresso na API
export async function resetProgress(): Promise<void> {
  try {
    const response = await fetch('/api/progress', {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Falha ao resetar progresso')
    }
  } catch (error) {
    console.error('Erro ao resetar progresso:', error)
    throw error
  }
}

// Função para salvar progresso de um capítulo específico
export async function saveChapterProgress(
  bookId: string, 
  chapterIndex: number, 
  isRead: boolean
): Promise<void> {
  try {
    // Carregar progresso atual
    const currentProgress = await loadProgress()
    
    // Atualizar o capítulo específico
    if (!currentProgress.books[bookId]) {
      currentProgress.books[bookId] = []
    }
    currentProgress.books[bookId][chapterIndex] = isRead
    
    // Salvar de volta
    await saveProgress(currentProgress)
  } catch (error) {
    console.error('Erro ao salvar progresso do capítulo:', error)
    throw error
  }
}