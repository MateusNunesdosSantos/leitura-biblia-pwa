# Deploy na Vercel - Solução para Banco de Dados

## Problema Identificado

O SQLite não funciona em ambientes serverless como a Vercel porque:
- Não há sistema de arquivos persistente
- Cada execução da função é isolada
- Os dados não persistem entre requisições

## Solução Implementada

### Sistema Híbrido de Armazenamento

Implementamos um sistema que funciona tanto localmente quanto na Vercel:

1. **Ambiente Local (Desenvolvimento)**:
   - Usa SQLite normalmente
   - Dados persistem no arquivo `bible-progress.db`
   - Performance otimizada

2. **Ambiente Serverless (Vercel)**:
   - Detecta automaticamente o ambiente
   - Usa armazenamento em memória no servidor
   - Usa localStorage no navegador para persistência
   - Funciona offline como PWA

### Arquivos Modificados

#### 1. `lib/database.ts`
- Detecta ambiente serverless
- Fallback para armazenamento em memória
- Mantém compatibilidade com SQLite local

#### 2. `lib/client-storage.ts` (NOVO)
- Gerencia localStorage no navegador
- Sincronização com servidor quando disponível
- Funciona offline

#### 3. `hooks/useProgress.ts` (NOVO)
- Hook React para gerenciar progresso
- Carregamento híbrido (servidor + localStorage)
- Sincronização automática

#### 4. `app/api/progress/route.ts`
- API adaptada para ambiente serverless
- Retorna informações sobre o modo de operação
- Graceful degradation em caso de erro

#### 5. `app/page.tsx` e `app/book/[id]/page.tsx`
- Atualizados para usar o novo hook
- Indicadores visuais de modo offline
- Loading states

## Como Funciona na Vercel

### 1. Primeira Visita
- Usuário acessa o site na Vercel
- Sistema detecta ambiente serverless
- Dados são carregados/salvos no localStorage
- Indicador visual mostra "Modo offline ativo"

### 2. Uso Contínuo
- Todos os dados ficam no localStorage do navegador
- Funciona offline como PWA
- Dados persistem entre sessões
- Sincronização automática quando online

### 3. Múltiplos Dispositivos
- Cada dispositivo mantém seus próprios dados
- Para sincronização entre dispositivos, seria necessário:
  - Banco de dados externo (PostgreSQL, MongoDB)
  - Sistema de autenticação
  - API de sincronização

## Vantagens da Solução

✅ **Funciona na Vercel**: Sem erros de banco de dados
✅ **Offline First**: PWA funciona sem internet
✅ **Performance**: localStorage é muito rápido
✅ **Compatibilidade**: Funciona em todos os navegadores modernos
✅ **Desenvolvimento**: SQLite local para desenvolvimento
✅ **Zero Config**: Não precisa configurar banco externo

## Limitações

⚠️ **Dados por dispositivo**: Cada navegador tem seus próprios dados
⚠️ **Limpeza de cache**: Dados podem ser perdidos se o usuário limpar o cache
⚠️ **Limite de armazenamento**: localStorage tem limite (~5-10MB)

## Alternativas para Sincronização

Se precisar de sincronização entre dispositivos:

### Opção 1: Supabase (Recomendado)
```bash
npm install @supabase/supabase-js
```
- PostgreSQL gratuito
- API automática
- Autenticação integrada
- Sincronização em tempo real

### Opção 2: PlanetScale
```bash
npm install @planetscale/database
```
- MySQL serverless
- Branching de banco
- Escalabilidade automática

### Opção 3: MongoDB Atlas
```bash
npm install mongodb
```
- NoSQL flexível
- Tier gratuito
- Global clusters

## Deploy na Vercel

### 1. Conectar Repositório
```bash
# No GitHub, conecte o repositório à Vercel
# Ou use a CLI da Vercel:
npm i -g vercel
vercel
```

### 2. Configurações de Build
- **Framework**: Next.js
- **Build Command**: `npm run build:pwa`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Variáveis de Ambiente
Nenhuma configuração necessária para a versão atual.

### 4. Deploy
```bash
vercel --prod
```

## Testando o Deploy

1. **Acesse o site na Vercel**
2. **Verifique o indicador**: "Modo offline ativo"
3. **Teste a funcionalidade**: Marque capítulos como lidos
4. **Teste offline**: Desconecte a internet e use o app
5. **Teste PWA**: Instale o app no celular

## Monitoramento

### Logs da Vercel
- Acesse o dashboard da Vercel
- Vá em "Functions" > "View Function Logs"
- Monitore erros e performance

### Analytics
- Vercel Analytics (opcional)
- Google Analytics (se configurado)
- Web Vitals automático

## Suporte

Se encontrar problemas:

1. **Verifique os logs** da Vercel
2. **Teste localmente** com `npm run build:pwa && npm run start:prod`
3. **Limpe o cache** do navegador
4. **Reinstale o PWA** se necessário

## Próximos Passos

Para melhorar ainda mais:

1. **Implementar autenticação** (opcional)
2. **Adicionar banco externo** para sincronização
3. **Implementar backup/restore** de dados
4. **Adicionar analytics** de uso
5. **Implementar notificações push**