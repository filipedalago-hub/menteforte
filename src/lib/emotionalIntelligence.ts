export interface UserContext {
  streak: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  moodScore?: number;
  energyLevel?: number;
  completionRate: number;
  totalSessions: number;
  daysSinceLastSession?: number;
  currentTrilha?: string;
  recentMilestones: string[];
  cognitiveStyle: string;
  consistencyScore: number;
}

export interface EmotionalMessage {
  text: string;
  tone: 'celebrating' | 'encouraging' | 'empathetic' | 'wise' | 'gentle' | 'motivating';
  type?: 'welcome' | 'celebration' | 'progress' | 'return' | 'insight' | 'challenge' | 'reflection';
}

export const emotionalMessages = {
  welcome: {
    first_time: [
      { text: "Você deu o primeiro passo. Isso já diz muito sobre quem você é.", tone: 'gentle' },
      { text: "Bem-vindo ao seu espaço de evolução. Aqui, cada momento conta.", tone: 'gentle' },
      { text: "Sua jornada começa agora. E você não está sozinho.", tone: 'empathetic' }
    ],

    morning: [
      { text: "Bom dia. Sua mente está fresca... vamos aproveitar?", tone: 'motivating' },
      { text: "Começar o dia assim mostra clareza de propósito.", tone: 'celebrating' },
      { text: "A manhã é sua. Que tal plantar algo bom na sua mente hoje?", tone: 'wise' }
    ],

    afternoon: [
      { text: "Meio do dia... e você veio. Isso é força.", tone: 'encouraging' },
      { text: "Pausar para cuidar da mente no meio do dia é sabedoria.", tone: 'wise' },
      { text: "Sua energia agora pode mudar o resto do seu dia.", tone: 'motivating' }
    ],

    evening: [
      { text: "Fim do dia, mas não fim da sua evolução.", tone: 'gentle' },
      { text: "Você voltou. Isso diz muito sobre seu compromisso.", tone: 'celebrating' },
      { text: "A noite é perfeita para reflexão profunda.", tone: 'wise' }
    ],

    night: [
      { text: "Tarde da noite... e você ainda cuida da sua mente. Impressionante.", tone: 'celebrating' },
      { text: "O silêncio da noite amplifica a voz interior.", tone: 'wise' },
      { text: "Sua dedicação não passa despercebida.", tone: 'empathetic' }
    ]
  },

  streak: {
    new_streak: [
      { text: "Segundo dia seguido. Você está criando um hábito.", tone: 'celebrating' },
      { text: "Sua mente já sente a diferença.", tone: 'encouraging' }
    ],

    week_streak: [
      { text: "Sete dias. Você não está mais testando, você está vivendo isso.", tone: 'celebrating' },
      { text: "Uma semana inteira. Sua consistência é sua maior força.", tone: 'wise' }
    ],

    strong_streak: [
      { text: "Seu compromisso com você mesmo inspira.", tone: 'celebrating' },
      { text: `${'{streak}'} dias consecutivos. Você está construindo algo raro.`, tone: 'wise' },
      { text: "Poucos chegam até aqui. Você é diferente.", tone: 'empathetic' }
    ],

    streak_broken: [
      { text: "Você voltou. E isso é o que importa.", tone: 'empathetic' },
      { text: "Recomeçar não é falhar. É coragem.", tone: 'encouraging' },
      { text: "Sua jornada continua. Cada dia é uma nova chance.", tone: 'gentle' }
    ]
  },

  progress: {
    first_exercise: [
      { text: "Primeiro exercício completo. Você começou de verdade.", tone: 'celebrating' },
      { text: "Esse foi só o começo. Sente a mudança?", tone: 'encouraging' }
    ],

    milestone_10: [
      { text: "10 exercícios. Sua mente está mais clara que quando começou.", tone: 'wise' },
      { text: "Você não percebe, mas já está diferente.", tone: 'empathetic' }
    ],

    milestone_25: [
      { text: "25 exercícios. Você está construindo algo profundo.", tone: 'celebrating' },
      { text: "Poucos chegam até aqui. Você é persistente.", tone: 'wise' }
    ],

    milestone_50: [
      { text: "50 exercícios. Você não é mais quem era.", tone: 'celebrating' },
      { text: "Metade de uma centena. Sua transformação é real.", tone: 'wise' }
    ],

    slow_progress: [
      { text: "Progresso não precisa ser rápido. Precisa ser verdadeiro.", tone: 'empathetic' },
      { text: "Cada passo importa. Mesmo os pequenos.", tone: 'gentle' },
      { text: "Você está no seu próprio ritmo. E está tudo bem.", tone: 'encouraging' }
    ]
  },

  return: {
    day_gap: [
      { text: "Você voltou. Isso já é vitória.", tone: 'encouraging' },
      { text: "Sentimos sua falta. Mas você está aqui agora.", tone: 'empathetic' }
    ],

    week_gap: [
      { text: "Passou um tempo... mas você não desistiu.", tone: 'empathetic' },
      { text: "Voltar depois de um tempo mostra força real.", tone: 'encouraging' },
      { text: "Sua jornada não acabou. Ela só pausou.", tone: 'gentle' }
    ],

    month_gap: [
      { text: "Faz tempo... mas você lembrou de voltar. Isso significa algo.", tone: 'empathetic' },
      { text: "Não importa quanto tempo passou. Você está aqui agora.", tone: 'gentle' },
      { text: "Recomeçar é uma das coisas mais difíceis. E você fez.", tone: 'celebrating' }
    ]
  },

  mood_based: {
    low_mood_low_energy: [
      { text: "Eu sei que às vezes é pesado... mas você veio. Isso conta.", tone: 'empathetic' },
      { text: "Dias difíceis também fazem parte. Você não está sozinho.", tone: 'gentle' },
      { text: "Apenas estar aqui hoje já é suficiente.", tone: 'empathetic' }
    ],

    low_mood_high_energy: [
      { text: "Você tem energia, mas algo pesa. Vamos trabalhar nisso juntos.", tone: 'encouraging' },
      { text: "Canalizar essa energia pode transformar como você se sente.", tone: 'motivating' }
    ],

    high_mood_low_energy: [
      { text: "Você está bem, mesmo cansado. Isso é equilíbrio.", tone: 'wise' },
      { text: "Energia baixa, mas espírito alto. Admirável.", tone: 'celebrating' }
    ],

    high_mood_high_energy: [
      { text: "Sua energia hoje está radiante. Vamos aproveitar!", tone: 'motivating' },
      { text: "Dias assim são presentes. Você está vibrando alto.", tone: 'celebrating' },
      { text: "Esse é o melhor momento para ir mais fundo.", tone: 'wise' }
    ]
  },

  insights: {
    morning_insights: [
      { text: "Cada manhã é uma nova chance de reescrever sua história.", tone: 'wise' },
      { text: "Sua mente pela manhã é como tela em branco. O que você vai pintar?", tone: 'wise' },
      { text: "O dia não acontece para você. Ele acontece através de você.", tone: 'wise' }
    ],

    evening_insights: [
      { text: "Refletir sobre o dia é tão importante quanto vivê-lo.", tone: 'wise' },
      { text: "Cada dia tem algo para ensinar. Você está ouvindo?", tone: 'wise' },
      { text: "A noite pergunta: quem você foi hoje?", tone: 'wise' }
    ],

    progress_insights: [
      { text: "Transformação real não faz barulho. Ela simplesmente acontece.", tone: 'wise' },
      { text: "Você não precisa ver para acreditar. Precisa acreditar para ver.", tone: 'wise' },
      { text: "Cada exercício é uma conversa com quem você está se tornando.", tone: 'wise' }
    ],

    consistency_insights: [
      { text: "Consistência é você escolhendo você mesmo, todo dia.", tone: 'wise' },
      { text: "Disciplina não é punição. É amor traduzido em ação.", tone: 'wise' },
      { text: "Pequenos passos diários criam caminhos que duram para sempre.", tone: 'wise' }
    ]
  },

  challenges: {
    new_challenge: [
      { text: "Pronto para expandir seus limites hoje?", tone: 'motivating' },
      { text: "Esse desafio foi feito para você. Você consegue.", tone: 'encouraging' }
    ],

    challenge_completed: [
      { text: "Você fez. E fez com excelência.", tone: 'celebrating' },
      { text: "Desafio superado. Você é mais forte do que pensa.", tone: 'celebrating' }
    ],

    challenge_abandoned: [
      { text: "Não desistiu. Só adiou. Quando quiser, estarei aqui.", tone: 'gentle' },
      { text: "Às vezes precisamos de mais tempo. E tudo bem.", tone: 'empathetic' }
    ]
  },

  session_feedback: {
    quick_session: [
      { text: "Sessão curta, mas presente. Isso já conta.", tone: 'encouraging' },
      { text: "Poucos minutos com intenção valem mais que horas distraídas.", tone: 'wise' }
    ],

    medium_session: [
      { text: "Você dedicou um bom tempo hoje. Sua mente agradece.", tone: 'celebrating' },
      { text: "Sessão equilibrada. Você está encontrando seu ritmo.", tone: 'encouraging' }
    ],

    long_session: [
      { text: "Sessão profunda. Você realmente mergulhou.", tone: 'celebrating' },
      { text: "Dedicação assim transforma. Parabéns.", tone: 'wise' }
    ]
  }
};

export class EmotionalIntelligenceEngine {

  static getWelcomeMessage(context: UserContext): EmotionalMessage {
    const { totalSessions, timeOfDay } = context;

    if (totalSessions === 0) {
      return this.selectRandom(emotionalMessages.welcome.first_time);
    }

    const timeMessages = emotionalMessages.welcome[timeOfDay] || emotionalMessages.welcome.evening;
    return this.selectRandom(timeMessages);
  }

  static getStreakMessage(context: UserContext): EmotionalMessage | null {
    const { streak, daysSinceLastSession } = context;

    if (daysSinceLastSession && daysSinceLastSession > 1) {
      return this.selectRandom(emotionalMessages.streak.streak_broken);
    }

    if (streak === 2) {
      return this.selectRandom(emotionalMessages.streak.new_streak);
    }

    if (streak === 7) {
      return this.selectRandom(emotionalMessages.streak.week_streak);
    }

    if (streak >= 14) {
      const message = this.selectRandom(emotionalMessages.streak.strong_streak);
      return {
        ...message,
        text: message.text.replace('{streak}', streak.toString())
      };
    }

    return null;
  }

  static getProgressMessage(totalExercises: number): EmotionalMessage | null {
    if (totalExercises === 1) {
      return this.selectRandom(emotionalMessages.progress.first_exercise);
    }

    if (totalExercises === 10) {
      return this.selectRandom(emotionalMessages.progress.milestone_10);
    }

    if (totalExercises === 25) {
      return this.selectRandom(emotionalMessages.progress.milestone_25);
    }

    if (totalExercises === 50) {
      return this.selectRandom(emotionalMessages.progress.milestone_50);
    }

    return null;
  }

  static getReturnMessage(context: UserContext): EmotionalMessage | null {
    const { daysSinceLastSession } = context;

    if (!daysSinceLastSession || daysSinceLastSession <= 1) {
      return null;
    }

    if (daysSinceLastSession <= 3) {
      return this.selectRandom(emotionalMessages.return.day_gap);
    }

    if (daysSinceLastSession <= 14) {
      return this.selectRandom(emotionalMessages.return.week_gap);
    }

    return this.selectRandom(emotionalMessages.return.month_gap);
  }

  static getMoodBasedMessage(context: UserContext): EmotionalMessage | null {
    const { moodScore, energyLevel } = context;

    if (!moodScore || !energyLevel) return null;

    if (moodScore <= 2 && energyLevel <= 2) {
      return this.selectRandom(emotionalMessages.mood_based.low_mood_low_energy);
    }

    if (moodScore <= 2 && energyLevel >= 4) {
      return this.selectRandom(emotionalMessages.mood_based.low_mood_high_energy);
    }

    if (moodScore >= 4 && energyLevel <= 2) {
      return this.selectRandom(emotionalMessages.mood_based.high_mood_low_energy);
    }

    if (moodScore >= 4 && energyLevel >= 4) {
      return this.selectRandom(emotionalMessages.mood_based.high_mood_high_energy);
    }

    return null;
  }

  static getDailyInsight(context: UserContext): EmotionalMessage {
    const { timeOfDay, consistencyScore } = context;

    if (consistencyScore >= 80) {
      return this.selectRandom(emotionalMessages.insights.consistency_insights);
    }

    if (timeOfDay === 'morning') {
      return this.selectRandom(emotionalMessages.insights.morning_insights);
    }

    if (timeOfDay === 'evening' || timeOfDay === 'night') {
      return this.selectRandom(emotionalMessages.insights.evening_insights);
    }

    return this.selectRandom(emotionalMessages.insights.progress_insights);
  }

  static getSessionFeedback(durationMinutes: number): EmotionalMessage {
    if (durationMinutes < 5) {
      return this.selectRandom(emotionalMessages.session_feedback.quick_session);
    }

    if (durationMinutes < 15) {
      return this.selectRandom(emotionalMessages.session_feedback.medium_session);
    }

    return this.selectRandom(emotionalMessages.session_feedback.long_session);
  }

  static getContextualMessage(context: UserContext): EmotionalMessage {
    const messages: EmotionalMessage[] = [];

    const returnMessage = this.getReturnMessage(context);
    if (returnMessage) return returnMessage;

    const streakMessage = this.getStreakMessage(context);
    if (streakMessage) messages.push(streakMessage);

    const moodMessage = this.getMoodBasedMessage(context);
    if (moodMessage) messages.push(moodMessage);

    if (messages.length > 0) {
      return this.selectRandom(messages);
    }

    return this.getWelcomeMessage(context);
  }

  static getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  }

  private static selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  static calculateConsistencyScore(
    currentStreak: number,
    _longestStreak: number,
    totalSessions: number,
    daysSinceStart: number
  ): number {
    const streakWeight = 0.4;
    const frequencyWeight = 0.6;

    const streakScore = Math.min((currentStreak / 30) * 100, 100);
    const frequencyScore = daysSinceStart > 0
      ? Math.min((totalSessions / daysSinceStart) * 100, 100)
      : 0;

    return Math.round(streakScore * streakWeight + frequencyScore * frequencyWeight);
  }

  static determineCognitiveStyle(
    completionRate: number,
    averageSessionDuration: number,
    abandonmentRate: number
  ): string {
    if (completionRate > 0.8 && averageSessionDuration > 15) {
      return 'profundo';
    }

    if (completionRate > 0.7 && averageSessionDuration < 10) {
      return 'eficiente';
    }

    if (abandonmentRate > 0.3) {
      return 'explorador';
    }

    if (completionRate < 0.5) {
      return 'descobrindo';
    }

    return 'equilibrado';
  }
}
