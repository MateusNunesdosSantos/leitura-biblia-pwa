# Build e Deploy da PWA - Leitura da Bíblia Católica

## 🚀 Como fazer o build para PWA

### 1. Build de Produção
```bash
npm run build:pwa
```

### 2. Iniciar em modo produção
```bash
npm run start:prod
```

### 3. Build padrão
```bash
npm run build
npm start
```

## 📱 Funcionalidades PWA Implementadas

### ✅ Manifest Web App
- **Arquivo**: `/public/manifest.json`
- **Ícones**: SVG otimizados (192x192 e 512x512)
- **Nome**: Leitura da Bíblia Católica
- **Modo**: Standalone (funciona como app nativo)
- **Tema**: Roxo (#4f46e5)
- **Atalhos**: Acesso rápido para Antigo e Novo Testamento

### ✅ Service Worker
- **Arquivo**: `/public/sw.js`
- **Cache offline**: Recursos estáticos e páginas
- **Background sync**: Sincronização quando voltar online
- **Estratégia**: Cache first com fallback para rede

### ✅ Instalação
- **Componente**: `PWAInstaller.tsx`
- **Prompt automático**: Aparece quando PWA pode ser instalada
- **Botões**: "Instalar" e "Agora não"
- **Posição**: Bottom banner responsivo

### ✅ Banco de Dados Local
- **SQLite**: `bible-progress.db`
- **API**: `/api/progress` (GET, POST, DELETE)
- **Persistência**: Dados salvos localmente
- **Sync**: Funciona offline e online

## 🔧 Configurações Técnicas

### Next.js Config
- **Compressão**: Habilitada
- **Headers PWA**: Cache otimizado
- **Service Worker**: Headers corretos
- **Manifest**: Cache longo prazo

### Otimizações
- **Tailwind**: Build otimizado
- **TypeScript**: Verificação de tipos
- **Linting**: ESLint configurado
- **Cross-env**: Compatibilidade Windows/Linux

## 📦 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build:pwa

# Publish directory
.next
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:pwa
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testando a PWA

### Chrome DevTools
1. Abra DevTools (F12)
2. Vá para **Application** tab
3. Verifique:
   - **Manifest**: Deve aparecer sem erros
   - **Service Workers**: Deve estar registrado
   - **Storage**: IndexedDB/SQLite funcionando

### Lighthouse
1. DevTools > **Lighthouse** tab
2. Selecione **Progressive Web App**
3. Clique **Generate report**
4. Score deve ser 90+ para PWA

### Teste de Instalação
1. Chrome: Ícone de instalação na barra de endereço
2. Mobile: Banner "Adicionar à tela inicial"
3. Edge: Menu > Apps > Instalar este site como app

## 📱 Funcionalidades Mobile

- **Responsivo**: Layout otimizado para mobile
- **Touch**: Gestos touch funcionais
- **Offline**: Funciona sem internet
- **Notificações**: Preparado para push notifications
- **Tela cheia**: Remove barras do navegador
- **Splash screen**: Tela de carregamento personalizada

## 🔍 Troubleshooting

### Service Worker não registra
```javascript
// Verificar no console
navigator.serviceWorker.getRegistrations().then(console.log)
```

### Manifest não carrega
- Verificar se `/public/manifest.json` existe
- Verificar headers no Network tab
- Validar JSON no [Web App Manifest Validator](https://manifest-validator.appspot.com/)

### Build falha
```bash
# Limpar cache
rm -rf .next node_modules
npm install
npm run build:pwa
```

### Banco não funciona
- Verificar se `bible-progress.db` foi criado
- Testar API: `curl http://localhost:3001/api/progress`
- Verificar logs do servidor

## 📊 Métricas PWA

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 90+
- **PWA**: 90+

---

**Desenvolvido com ❤️ para uma experiência de leitura bíblica moderna e acessível.**