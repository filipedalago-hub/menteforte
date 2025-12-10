# Mentes.ia - Plataforma de Desenvolvimento Mental com IA

Uma aplicacao web futurista e gamificada para desenvolvimento mental e espiritual, potencializada por inteligencia artificial.

## Visao Geral

**Mentes.ia** e uma plataforma completa que oferece tres trilhas de aprendizado:

1. **Fundamentos Mentais** - Base solida de autoconhecimento, inteligencia emocional e mentalidade de crescimento
2. **Treinamento da Mente** - Neuro-habitos avancados para desbloquear potencial mental maximo
3. **Proposito, Espiritualidade e Deus** - Descoberta de proposito e conexao espiritual profunda

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Roteamento**: React Router v7
- **Estilizacao**: TailwindCSS + CSS customizado
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticacao**: Supabase Auth (Email/Password)
- **Icones**: Lucide React
- **Testes**: Vitest + React Testing Library

## Funcionalidades Implementadas

### Sistema de Gamificacao
- Sistema de XP (Pontos de Experiencia)
- Niveis progressivos baseados em XP
- Streak diario (sequencia de dias consecutivos)
- Sistema de badges/conquistas
- Progresso visual em todas as telas
- Feedback imediato ao completar exercicios

### Trilhas e Exercicios
- 3 trilhas completas de aprendizado
- 16 pilares distribuidos entre as trilhas
- Multiplos exercicios por pilar
- 9 tipos diferentes de exercicios:
  - Reflexao (texto longo)
  - Multipla escolha com feedback
  - Escalas de avaliacao
  - Checklists
  - Atencao focada com timer
  - Respiracao guiada com animacao
  - Lista de gratidao
  - Reflexao espiritual/oracao
  - Autoavaliacao moral

### Funcionalidades Tecnicas
- Autosave com debounce (800ms)
- Indicadores visuais de salvamento
- Sistema de toasts para notificacoes
- Breadcrumbs em todas as paginas
- Skeletons durante carregamento
- Navegacao responsiva (desktop/tablet/mobile)
- Acessibilidade (ARIA labels, navegacao por teclado)
- Animacoes e microinteracoes
- Tratamento de erros com feedback visual

### Paginas Implementadas
- Landing page futurista
- Login e Signup com tema dark
- Dashboard com cards das trilhas
- Pagina de trilha (lista de pilares)
- Pagina de pilar (lista de exercicios)
- Pagina de exercicio (todos os tipos)
- Perfil do usuario
- Configuracoes
- Central de ajuda
- Pagina 404

## Como Rodar Localmente

### Pre-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalacao

1. Clone o repositorio:
```bash
cd /tmp/cc-agent/60272935/project
```

2. Instale as dependencias:
```bash
npm install
```

3. As variaveis de ambiente ja estao configuradas no arquivo `.env`

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em `http://localhost:5173`

## Como Testar

### Testes Unitarios

Execute os testes unitarios:
```bash
npm test
```

Para rodar os testes em modo watch:
```bash
npm run test:watch
```

## Build de Producao

Para criar o build de producao:
```bash
npm run build
```

Os arquivos otimizados serao gerados na pasta `dist/`.

Para testar o build localmente:
```bash
npm run preview
```

## Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizaveis
│   ├── exercises/      # Componentes de exercicios
│   ├── __tests__/      # Testes de componentes
│   ├── AppLayout.tsx
│   ├── Breadcrumbs.tsx
│   ├── Logo.tsx
│   ├── ProgressBar.tsx
│   ├── Skeleton.tsx
│   ├── Toast.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos React (Auth)
├── hooks/             # Custom hooks
├── lib/               # Configuracao Supabase
├── pages/             # Paginas da aplicacao
├── utils/             # Funcoes utilitarias
└── test/              # Setup de testes
```

## Banco de Dados

### Tabelas Principais
- `profiles` - Perfis de usuario com XP, level, streak
- `trilhas` - Trilhas de aprendizado
- `pilares` - Pilares dentro de cada trilha
- `exercises` - Exercicios individuais
- `user_exercise_progress` - Progresso do usuario
- `badges` - Conquistas disponiveis
- `user_badges` - Conquistas desbloqueadas

Todas as tabelas possuem Row Level Security (RLS) configurado para garantir que usuarios so acessem seus proprios dados.

## Design Futurista

### Paleta de Cores Tech
- **Azul Primario**: #00AEEF - Botoes principais, destaques
- **Ciano Eletrico**: #14F1FF - Efeitos glow, estados ativos
- **Azul Neonico**: #0066FF - Gradientes, elementos fortes
- **Fundo Escuro**: #0A0F2D - Background principal
- **Fundo Escuro Claro**: #111936 - Cards e secoes
- **Cinza Titanium**: #2F3A4D - Elementos secundarios
- **Branco Suave**: #E6F1FF - Textos principais
- **Cinza Suave**: #A9B9D6 - Subtitulos

### Gradientes
- **Principal**: #00AEEF → #0066FF
- **Especial**: #14F1FF → #00AEEF

### Identidade Visual
- **Logo**: Cerebro com circuitos neurais em cyan neon
- **Tipografia**: Mentes.ia (com destaque cyan no ".ia")
- **Efeitos**: Glow neon, blur, animacoes float e pulse
- **Icones**: Lucide React com cores futuristas
- **Tema**: Sci-fi, high-tech, minimalista

### Estetica
- Interface futurista minimalista
- Neon cyan com detalhes sutis
- Luxo tecnologico
- Cartoes flutuantes com bordas glow
- UI elegante, limpa e moderna
- Animacoes suaves e microinteracoes

## Estrutura de Gamificacao

### Sistema de XP
- Cada exercicio concede 10-20 XP
- Nivel = √(XP/100) + 1
- XP para proximo nivel = (nivel²) × 100

### Sistema de Streak
- Completa pelo menos 1 exercicio por dia
- Streak quebra se passar mais de 1 dia sem atividade
- Registro do maior streak alcancado

### Badges Disponiveis
1. **Primeiro Passo** - Complete 1 exercicio
2. **Explorador** - Complete 10 exercicios
3. **Dedicado** - 7 dias de sequencia
4. **Mestre Mental** - Complete 50 exercicios
5. **Fogo Constante** - 30 dias de sequencia

## Responsividade

A aplicacao e totalmente responsiva com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Acessibilidade

- Todos os elementos interativos sao acessiveis via teclado
- ARIA labels em todos os componentes importantes
- Roles semanticos (navigation, main, button, etc.)
- Contraste adequado de cores (WCAG AA)
- Feedback visual e textual para acoes
- Foco visivel em todos os elementos interativos

## Observacoes Importantes

1. **Autenticacao**: Email/password via Supabase Auth
2. **Persistencia**: Todos os dados sao salvos no Supabase
3. **Autosave**: Respostas sao salvas automaticamente apos 800ms
4. **Offline**: Nao ha suporte offline (requer conexao)
5. **Browser Support**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## Autor

Desenvolvido como plataforma completa de desenvolvimento mental com IA e design futurista.

---

**Mentes.ia** - Transformando mentes, transformando vidas.
