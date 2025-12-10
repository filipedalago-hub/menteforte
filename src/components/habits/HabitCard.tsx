import { Check, Edit2, Trash2, Flame, TrendingUp, Calendar } from 'lucide-react';
import { HabitWithStats } from '../../types/habits';

interface HabitCardProps {
  habit: HabitWithStats;
  onComplete: (habitId: string) => void;
  onUncomplete: (habitId: string) => void;
  onEdit: (habit: HabitWithStats) => void;
  onDelete: (habitId: string) => void;
}

const categoryColors: Record<string, string> = {
  health: 'text-green-400 bg-green-400/10 border-green-400/30',
  spiritual: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  personal: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30',
  professional: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  financial: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  relationships: 'text-pink-400 bg-pink-400/10 border-pink-400/30',
};

const categoryLabels: Record<string, string> = {
  health: 'Saúde',
  spiritual: 'Espiritual',
  personal: 'Pessoal',
  professional: 'Profissional',
  financial: 'Financeiro',
  relationships: 'Relacionamentos',
};

const frequencyLabels: Record<string, string> = {
  daily: 'Diário',
  weekly: 'Semanal',
  custom: 'Personalizado',
};

export function HabitCard({ habit, onComplete, onUncomplete, onEdit, onDelete }: HabitCardProps) {
  const handleToggle = () => {
    if (habit.is_completed_today) {
      onUncomplete(habit.id);
    } else {
      onComplete(habit.id);
    }
  };

  return (
    <div className={`card-dark group transition-all ${habit.is_completed_today ? 'ring-2 ring-green-400/30 shadow-glow-sm' : 'hover:shadow-glow-sm'}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[habit.category]}`}>
              {categoryLabels[habit.category]}
            </span>
            <span className="text-xs px-2 py-1 rounded-full border bg-titanium/20 border-titanium/30 text-soft-gray">
              {frequencyLabels[habit.frequency]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-soft-white mb-1">{habit.title}</h3>
          {habit.description && (
            <p className="text-sm text-soft-gray line-clamp-2">{habit.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 rounded-lg hover:bg-titanium/20 text-soft-gray hover:text-neon-cyan transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-soft-gray hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-titanium/10 rounded-lg border border-titanium/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs text-soft-gray">Streak</span>
          </div>
          <p className="text-xl font-bold text-soft-white">{habit.current_streak}</p>
        </div>
        <div className="text-center p-3 bg-titanium/10 rounded-lg border border-titanium/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-soft-gray">Taxa</span>
          </div>
          <p className="text-xl font-bold text-soft-white">{habit.completion_rate}%</p>
        </div>
        <div className="text-center p-3 bg-titanium/10 rounded-lg border border-titanium/30">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-xs text-soft-gray">Total</span>
          </div>
          <p className="text-xl font-bold text-soft-white">{habit.total_completions}</p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          habit.is_completed_today
            ? 'bg-green-500/20 border-2 border-green-400/50 text-green-400 hover:bg-green-500/30'
            : 'bg-primary/20 border-2 border-primary/30 text-primary hover:bg-primary/30'
        }`}
      >
        {habit.is_completed_today ? (
          <>
            <Check className="w-5 h-5" />
            Concluído Hoje
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Marcar como Concluído
          </>
        )}
      </button>
    </div>
  );
}
