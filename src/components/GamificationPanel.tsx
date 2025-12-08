import { Trophy, Flame, Star, TrendingUp, Award } from 'lucide-react';

interface GamificationPanelProps {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  totalExercises: number;
  recentBadges?: Array<{
    name: string;
    icon_name: string;
    earned_at: string;
  }>;
  consistencyScore: number;
}

export function GamificationPanel({
  xp,
  level,
  streak,
  longestStreak,
  totalExercises,
  recentBadges = [],
  consistencyScore
}: GamificationPanelProps) {
  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / xpForNextLevel * 100;

  const getStreakMessage = () => {
    if (streak === 0) return 'Comece sua sequência hoje';
    if (streak === 1) return 'Continue amanhã!';
    if (streak < 7) return 'Você está criando um hábito';
    if (streak < 30) return 'Consistência impressionante';
    return 'Você é imparável!';
  };

  const getConsistencyColor = () => {
    if (consistencyScore >= 80) return 'text-green-600 bg-green-50';
    if (consistencyScore >= 60) return 'text-blue-600 bg-blue-50';
    if (consistencyScore >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getConsistencyLabel = () => {
    if (consistencyScore >= 80) return 'Excelente';
    if (consistencyScore >= 60) return 'Muito bom';
    if (consistencyScore >= 40) return 'Progredindo';
    return 'Começando';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-accent-gold" />
            <span className="text-sm font-medium text-gray-700">Nível {level}</span>
          </div>
          <span className="text-sm text-gray-500">{xp % 100}/{xpForNextLevel} XP</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-gold to-accent-orange transition-all duration-500 ease-out"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-accent-orange/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-accent-orange" />
            <span className="text-sm font-medium text-gray-700">Sequência</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{streak}</p>
          <p className="text-xs text-gray-600 mt-1">{getStreakMessage()}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-primary/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-700">Exercícios</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalExercises}</p>
          <p className="text-xs text-gray-600 mt-1">concluídos</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-secondary-purple/20 to-secondary-mint/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-secondary-purple" />
            <span className="text-sm font-medium text-gray-700">Consistência</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConsistencyColor()}`}>
            {getConsistencyLabel()}
          </span>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-purple to-primary transition-all duration-500"
              style={{ width: `${consistencyScore}%` }}
            />
          </div>
          <span className="text-sm font-bold text-gray-900">{consistencyScore}%</span>
        </div>
      </div>

      {longestStreak > 0 && (
        <div className="flex items-center gap-3 p-3 bg-accent-gold/20 rounded-xl">
          <Award className="w-5 h-5 text-accent-gold" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Maior sequência</p>
            <p className="text-xs text-gray-600">{longestStreak} dias consecutivos</p>
          </div>
        </div>
      )}

      {recentBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Conquistas Recentes
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentBadges.map((badge, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-accent-gold/30 to-accent-orange/30 rounded-xl flex items-center justify-center border border-accent-gold/40"
                title={badge.name}
              >
                <span className="text-2xl">{badge.icon_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
