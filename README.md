# MenteForte - Plataforma de Desenvolvimento Mental

Uma aplicação web gamificada para desenvolvimento mental e espiritual, inspirada no modelo de aprendizado do Duolingo, mas com identidade visual e conteúdo 100% originais.

## Visão Geral

MenteForte é uma plataforma completa que oferece três trilhas de aprendizado:

1. **Fundamentos Mentais** - Base sólida de autoconhecimento, inteligência emocional e mentalidade de crescimento
2. **Treinamento da Mente** - Neuro-hábitos avançados para desbloquear potencial mental máximo
3. **Propósito, Espiritualidade e Deus** - Descoberta de propósito e conexão espiritual profunda

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Roteamento**: React Router v7
- **Estilização**: TailwindCSS + CSS customizado
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth (Email/Password)
- **Ícones**: Lucide React
- **Testes**: Vitest + React Testing Library

## Funcionalidades Implementadas

### Sistema de Gamificação
- ✅ Sistema de XP (Pontos de Experiência)
- ✅ Níveis progressivos baseados em XP
- ✅ Streak diário (sequência de dias consecutivos)
- ✅ Sistema de badges/conquistas
- ✅ Progresso visual em todas as telas
- ✅ Feedback imediato ao completar exercícios

### Trilhas e Exercícios
- ✅ 3 trilhas completas de aprendizado
- ✅ 16 pilares distribuídos entre as trilhas
- ✅ Múltiplos exercícios por pilar
- ✅ 9 tipos diferentes de exercícios:
  - Reflexão (texto longo)
  - Múltipla escolha com feedback
  - Escalas de avaliação
  - Checklists
  - Atenção focada com timer
  - Respiração guiada com animação
  - Lista de gratidão
  - Reflexão espiritual/oração
  - Autoavaliação moral

### Funcionalidades Técnicas
- ✅ Autosave com debounce (800ms)
- ✅ Indicadores visuais de salvamento
- ✅ Sistema de toasts para notificações
- ✅ Breadcrumbs em todas as páginas
- ✅ Skeletons durante carregamento
- ✅ Navegação responsiva (desktop/tablet/mobile)
- ✅ Acessibilidade (ARIA labels, navegação por teclado)
- ✅ Animações e microinterações
- ✅ Tratamento de erros com feedback visual

### Páginas Implementadas
- ✅ Landing page
- ✅ Login e Signup
- ✅ Dashboard com cards das trilhas
- ✅ Página de trilha (lista de pilares)
- ✅ Página de pilar (lista de exercícios)
- ✅ Página de exercício (todos os tipos)
- ✅ Perfil do usuário
- ✅ Configurações
- ✅ Central de ajuda
- ✅ Página 404

## Como Rodar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
cd /tmp/cc-agent/60272935/project
```

2. Instale as dependências:
```bash
npm install
```

3. As variáveis de ambiente já estão configuradas no arquivo `.env`

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em `http://localhost:5173`

## Como Testar

### Testes Unitários

Execute os testes unitários:
```bash
npm test
```

Para rodar os testes em modo watch:
```bash
npm run test:watch
```

### Teste E2E Manual

1. Crie uma nova conta em `/signup`
2. Faça login com suas credenciais
3. No dashboard, escolha a trilha "Fundamentos Mentais"
4. Selecione o pilar "Autoconhecimento"
5. Complete o exercício "Identificando Seus Valores"
6. Observe o XP sendo adicionado
7. Volte ao dashboard e veja o progresso atualizado
8. Verifique que os dados foram salvos recarregando a página

## Build de Produção

Para criar o build de produção:
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

Para testar o build localmente:
```bash
npm run preview
```

## Arquitetura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── exercises/      # Componentes de exercícios
│   ├── __tests__/      # Testes de componentes
│   ├── AppLayout.tsx
│   ├── Breadcrumbs.tsx
│   ├── ProgressBar.tsx
│   ├── Skeleton.tsx
│   ├── Toast.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # Contextos React (Auth)
├── hooks/             # Custom hooks
├── lib/               # Configuração Supabase
├── pages/             # Páginas da aplicação
├── utils/             # Funções utilitárias
└── test/              # Setup de testes
```

## Banco de Dados

### Tabelas Principais
- `profiles` - Perfis de usuário com XP, level, streak
- `trilhas` - Trilhas de aprendizado
- `pilares` - Pilares dentro de cada trilha
- `exercises` - Exercícios individuais
- `user_exercise_progress` - Progresso do usuário
- `badges` - Conquistas disponíveis
- `user_badges` - Conquistas desbloqueadas

Todas as tabelas possuem Row Level Security (RLS) configurado para garantir que usuários só acessem seus próprios dados.

## Design Original

### Paleta de Cores
- Primária: Azul (#2563EB)
- Sucesso: Verde (#10B981)
- Aviso: Laranja (#F59E0B)
- Destaque: Roxo (#9333EA)
- Neutros: Escala de cinza

### Identidade Visual
- **Logo**: Raio (Zap) em azul representando energia mental
- **Mascote**: Não utilizado (diferente do Duolingo)
- **Tipografia**: System fonts para melhor performance
- **Ícones**: Lucide React (biblioteca open source)
- **Badges originais**: Crown, Award, Compass, Flame, Zap

### Inspiração vs. Implementação
Enquanto a gamificação foi **inspirada** no Duolingo, todos os elementos visuais, textos, exercícios e design são **100% originais**:
- Cores diferentes
- Ícones diferentes
- Exercícios criados especificamente para desenvolvimento mental
- Conteúdo espiritual único
- Layout e componentes próprios

## Estrutura de Gamificação

### Sistema de XP
- Cada exercício concede 10-20 XP
- Nível = √(XP/100) + 1
- XP para próximo nível = (nível²) × 100

### Sistema de Streak
- Completa pelo menos 1 exercício por dia
- Streak quebra se passar mais de 1 dia sem atividade
- Registro do maior streak alcançado

### Badges Disponíveis
1. **Primeiro Passo** - Complete 1 exercício
2. **Explorador** - Complete 10 exercícios
3. **Dedicado** - 7 dias de sequência
4. **Mestre Mental** - Complete 50 exercícios
5. **Fogo Constante** - 30 dias de sequência

## Responsividade

A aplicação é totalmente responsiva com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Acessibilidade

- ✅ Todos os elementos interativos são acessíveis via teclado
- ✅ ARIA labels em todos os componentes importantes
- ✅ Roles semânticos (navigation, main, button, etc.)
- ✅ Contraste adequado de cores (WCAG AA)
- ✅ Feedback visual e textual para ações
- ✅ Foco visível em todos os elementos interativos

## Observações Importantes

1. **Autenticação**: Email/password via Supabase Auth
2. **Persistência**: Todos os dados são salvos no Supabase
3. **Autosave**: Respostas são salvas automaticamente após 800ms
4. **Offline**: Não há suporte offline (requer conexão)
5. **Browser Support**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

## Limitações Conhecidas

- Sistema de loja de recompensas é apenas UI (não funcional)
- Planos Pro Mensal/Anual são apenas UI (não há sistema de pagamento)
- Notificações push não implementadas
- Modo escuro não implementado (apenas UI no settings)

## Autor

Desenvolvido como projeto de demonstração de uma plataforma completa de desenvolvimento mental gamificada.

---

**Não houve publicação** - Este projeto está pronto para execução local ou deploy manual.
