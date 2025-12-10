# Mentes.ia - Plataforma de Desenvolvimento Mental com IA

![Mentes.ia](./public/assets/logo/mentes-ia-full.png)

## 🧠 Sobre o Projeto

Mentes.ia é uma plataforma futurista de desenvolvimento mental e espiritual que utiliza tecnologia de IA para ajudar usuários a transformarem suas vidas através de:

- 🎯 **Metas e Hábitos**: Sistema inteligente de acompanhamento
- 🎮 **Gamificação**: XP, níveis, streaks e badges
- 🧘 **Trilhas de Desenvolvimento**: 5 pilares (Físico, Emocional, Mental, Social, Espiritual)
- 📊 **Dashboard Personalizado**: Acompanhamento de progresso
- 💭 **Exercícios Interativos**: Meditação, reflexão e práticas guiadas
- 🔄 **Feedback Emocional**: Sistema adaptativo de recompensas

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Design System customizado
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **PWA**: Progressive Web App ready

## 📦 Instalação

\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## 🔧 Scripts Disponíveis

- \`npm run dev\` - Inicia servidor de desenvolvimento
- \`npm run build\` - Build de produção
- \`npm run preview\` - Preview do build
- \`npm run lint\` - Linter
- \`npm run test\` - Testes

## 🎮 Sistema de Gamificação

Ver documentação completa em: \`GAMIFICATION_SYSTEM.md\`

### XP (Experience Points)
- Check-in diário: +5 XP
- Hábito concluído: +5 XP
- Meta alcançada: +10 XP
- Exercício completado: +8 XP

### Níveis (1-10)
Aprendiz → Explorador → Praticante → Dedicado → Resiliente → Focado → Disciplinado → Transformador → Iluminado → Mestre Interior

### Badges (15 conquistas)
De Comum a Lendário, organizados por raridade

## 📱 PWA

O app é um PWA completo e pode ser instalado em dispositivos móveis e desktop.

## 🔐 Segurança

- RLS habilitado em todas as tabelas
- Environment variables para secrets
- HTTPS obrigatório
- Headers de segurança configurados

## 📝 Licença

MIT License

---

**Desenvolvido com 💙 pela equipe Mentes.ia**

*Transforme sua mente, transforme sua vida.*
