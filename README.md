# Leitura da Bíblia Católica

Aplicativo web para acompanhar o progresso de leitura da Bíblia Católica com 73 livros canônicos.

## Funcionalidades

- ✅ **Controle de progresso geral** - Acompanhe o percentual de leitura da Bíblia completa
- ✅ **Progresso por livro** - Visualize o avanço individual de cada livro 
- ✅ **Marcação de capítulos** - Marque/desmarque capítulos lidos com um clique
- ✅ **Filtros por testamento** - Visualize separadamente Antigo e Novo Testamento
- ✅ **Interface responsiva** - Otimizada para celular e desktop
- ✅ **Armazenamento local** - Seu progresso é salvo automaticamente no navegador
- ✅ **Reset de progresso** - Comece do zero quando quiser

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (sem PostCSS adicional)
- LocalStorage para persistência
- Lucide React para ícones

## Como usar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Rodar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Abrir no navegador:** http://localhost:3000

## Estrutura

- `/app` - Páginas e layout principal
- `/components` - Componentes reutilizáveis  
- `/lib` - Dados da Bíblia e utilitários
- Tailwind configurado para modo mobile-first
- Persiste dados automaticamente no localStorage

## Interface

A interface é dividida em:

- **Cabeçalho** com título e botão para zerar progresso
- **Barra de progresso geral** mostrando avanço total
- **Filtros** para alternar entre todos os livros, Antigo e Novo Testamento
- **Cartões de livros** com grade de capítulos clicáveis
- **Indicadores visuais** de progresso por livro

Cada capítulo pode ser marcado/desmarcado independentemente, e o progresso é calculado automaticamente em tempo real.