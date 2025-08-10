export interface BibleBook {
  id: string
  name: string
  chapters: number
  testament: 'old' | 'new'
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento
  { id: 'genesis', name: 'Gênesis', chapters: 50, testament: 'old' },
  { id: 'exodus', name: 'Êxodo', chapters: 40, testament: 'old' },
  { id: 'leviticus', name: 'Levítico', chapters: 27, testament: 'old' },
  { id: 'numbers', name: 'Números', chapters: 36, testament: 'old' },
  { id: 'deuteronomy', name: 'Deuteronômio', chapters: 34, testament: 'old' },
  { id: 'joshua', name: 'Josué', chapters: 24, testament: 'old' },
  { id: 'judges', name: 'Juízes', chapters: 21, testament: 'old' },
  { id: 'ruth', name: 'Rute', chapters: 4, testament: 'old' },
  { id: '1samuel', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2samuel', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1kings', name: '1 Reis', chapters: 22, testament: 'old' },
  { id: '2kings', name: '2 Reis', chapters: 25, testament: 'old' },
  { id: '1chronicles', name: '1 Crônicas', chapters: 29, testament: 'old' },
  { id: '2chronicles', name: '2 Crônicas', chapters: 36, testament: 'old' },
  { id: 'ezra', name: 'Esdras', chapters: 10, testament: 'old' },
  { id: 'nehemiah', name: 'Neemias', chapters: 13, testament: 'old' },
  { id: 'tobit', name: 'Tobias', chapters: 14, testament: 'old' },
  { id: 'judith', name: 'Judite', chapters: 16, testament: 'old' },
  { id: 'esther', name: 'Ester', chapters: 16, testament: 'old' },
  { id: '1maccabees', name: '1 Macabeus', chapters: 16, testament: 'old' },
  { id: '2maccabees', name: '2 Macabeus', chapters: 15, testament: 'old' },
  { id: 'job', name: 'Jó', chapters: 42, testament: 'old' },
  { id: 'psalms', name: 'Salmos', chapters: 150, testament: 'old' },
  { id: 'proverbs', name: 'Provérbios', chapters: 31, testament: 'old' },
  { id: 'ecclesiastes', name: 'Eclesiastes', chapters: 12, testament: 'old' },
  { id: 'songs', name: 'Cântico dos Cânticos', chapters: 8, testament: 'old' },
  { id: 'wisdom', name: 'Sabedoria', chapters: 19, testament: 'old' },
  { id: 'sirach', name: 'Eclesiástico', chapters: 51, testament: 'old' },
  { id: 'isaiah', name: 'Isaías', chapters: 66, testament: 'old' },
  { id: 'jeremiah', name: 'Jeremias', chapters: 52, testament: 'old' },
  { id: 'lamentations', name: 'Lamentações', chapters: 5, testament: 'old' },
  { id: 'baruch', name: 'Baruc', chapters: 6, testament: 'old' },
  { id: 'ezekiel', name: 'Ezequiel', chapters: 48, testament: 'old' },
  { id: 'daniel', name: 'Daniel', chapters: 14, testament: 'old' },
  { id: 'hosea', name: 'Oseias', chapters: 14, testament: 'old' },
  { id: 'joel', name: 'Joel', chapters: 4, testament: 'old' },
  { id: 'amos', name: 'Amós', chapters: 9, testament: 'old' },
  { id: 'obadiah', name: 'Abdias', chapters: 1, testament: 'old' },
  { id: 'jonah', name: 'Jonas', chapters: 4, testament: 'old' },
  { id: 'micah', name: 'Miqueias', chapters: 7, testament: 'old' },
  { id: 'nahum', name: 'Naum', chapters: 3, testament: 'old' },
  { id: 'habakkuk', name: 'Habacuc', chapters: 3, testament: 'old' },
  { id: 'zephaniah', name: 'Sofonias', chapters: 3, testament: 'old' },
  { id: 'haggai', name: 'Ageu', chapters: 2, testament: 'old' },
  { id: 'zechariah', name: 'Zacarias', chapters: 14, testament: 'old' },
  { id: 'malachi', name: 'Malaquias', chapters: 4, testament: 'old' },

  // Novo Testamento
  { id: 'matthew', name: 'Mateus', chapters: 28, testament: 'new' },
  { id: 'mark', name: 'Marcos', chapters: 16, testament: 'new' },
  { id: 'luke', name: 'Lucas', chapters: 24, testament: 'new' },
  { id: 'john', name: 'João', chapters: 21, testament: 'new' },
  { id: 'acts', name: 'Atos dos Apóstolos', chapters: 28, testament: 'new' },
  { id: 'romans', name: 'Romanos', chapters: 16, testament: 'new' },
  { id: '1corinthians', name: '1 Coríntios', chapters: 16, testament: 'new' },
  { id: '2corinthians', name: '2 Coríntios', chapters: 13, testament: 'new' },
  { id: 'galatians', name: 'Gálatas', chapters: 6, testament: 'new' },
  { id: 'ephesians', name: 'Efésios', chapters: 6, testament: 'new' },
  { id: 'philippians', name: 'Filipenses', chapters: 4, testament: 'new' },
  { id: 'colossians', name: 'Colossenses', chapters: 4, testament: 'new' },
  { id: '1thessalonians', name: '1 Tessalonicenses', chapters: 5, testament: 'new' },
  { id: '2thessalonians', name: '2 Tessalonicenses', chapters: 3, testament: 'new' },
  { id: '1timothy', name: '1 Timóteo', chapters: 6, testament: 'new' },
  { id: '2timothy', name: '2 Timóteo', chapters: 4, testament: 'new' },
  { id: 'titus', name: 'Tito', chapters: 3, testament: 'new' },
  { id: 'philemon', name: 'Filemon', chapters: 1, testament: 'new' },
  { id: 'hebrews', name: 'Hebreus', chapters: 13, testament: 'new' },
  { id: 'james', name: 'Tiago', chapters: 5, testament: 'new' },
  { id: '1peter', name: '1 Pedro', chapters: 5, testament: 'new' },
  { id: '2peter', name: '2 Pedro', chapters: 3, testament: 'new' },
  { id: '1john', name: '1 João', chapters: 5, testament: 'new' },
  { id: '2john', name: '2 João', chapters: 1, testament: 'new' },
  { id: '3john', name: '3 João', chapters: 1, testament: 'new' },
  { id: 'jude', name: 'Judas', chapters: 1, testament: 'new' },
  { id: 'revelation', name: 'Apocalipse', chapters: 22, testament: 'new' }
]

export const getTestamentBooks = (testament: 'old' | 'new') => 
  BIBLE_BOOKS.filter(book => book.testament === testament)

export const getTotalChapters = () => 
  BIBLE_BOOKS.reduce((total, book) => total + book.chapters, 0)

export const getTotalChaptersByTestament = (testament: 'old' | 'new') =>
  getTestamentBooks(testament).reduce((total, book) => total + book.chapters, 0)