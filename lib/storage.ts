// Re-exportar funções da API para manter compatibilidade
export { 
  loadProgress, 
  saveProgress, 
  resetProgress,
  saveChapterProgress,
  type ProgressMap,
  type ProgressState
} from './api-storage'