import { Target, Calendar, TrendingUp, Check, Edit2, Trash2 } from 'lucide-react';
import { Goal } from '../../types/goals';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, value: number) => void;
  onComplete: (goalId: string) => void;
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

export function GoalCard({ goal, onEdit, onDelete, onUpdateProgress, onComplete }: GoalCardProps) {
  const progress = goal.target_type === 'numeric' && goal.target_value
    ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
    : goal.status === 'completed' ? 100 : 0;

  const isCompleted = goal.status === 'completed';
  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted;

  const handleProgressIncrement = () => {
    if (goal.target_type === 'numeric' && goal.target_value) {
      const newValue = Math.min(goal.target_value, goal.current_value + 1);
      onUpdateProgress(goal.id, newValue);
      if (newValue >= goal.target_value) {
        onComplete(goal.id);
      }
    }
  };

  return (
    <div className="card-dark group hover:shadow-glow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[goal.category]}`}>
              {categoryLabels[goal.category]}
            </span>
            {isOverdue && (
              <span className="text-xs px-2 py-1 rounded-full border bg-red-500/10 border-red-500/30 text-red-400">
                Atrasada
              </span>
            )}
            {isCompleted && (
              <span className="text-xs px-2 py-1 rounded-full border bg-green-500/10 border-green-500/30 text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Concluída
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-soft-white mb-1">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-soft-gray line-clamp-2">{goal.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 rounded-lg hover:bg-titanium/20 text-soft-gray hover:text-neon-cyan transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 rounded-lg hover:bg-red-500/10 text-soft-gray hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {goal.target_type === 'numeric' && goal.target_value && (
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-soft-gray">
              <TrendingUp className="w-4 h-4" />
              <span>Progresso</span>
            </div>
            <span className="text-soft-white font-semibold">
              {goal.current_value} / {goal.target_value} {goal.unit}
            </span>
          </div>
          <div className="relative">
            <div className="w-full bg-titanium rounded-full h-2">
              <div
                className="bg-gradient-primary h-full rounded-full transition-all shadow-glow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="absolute right-0 -top-6 text-xs text-neon-cyan font-bold">
              {progress}%
            </span>
          </div>
          {!isCompleted && (
            <button
              onClick={handleProgressIncrement}
              className="w-full mt-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary text-sm font-medium transition-colors"
            >
              + Adicionar 1 {goal.unit}
            </button>
          )}
        </div>
      )}

      {goal.target_type === 'boolean' && !isCompleted && (
        <button
          onClick={() => onComplete(goal.id)}
          className="w-full mt-3 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Marcar como Concluída
        </button>
      )}

      {goal.deadline && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-titanium/30 text-sm text-soft-gray">
          <Calendar className="w-4 h-4" />
          <span>
            Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
          </span>
        </div>
      )}
    </div>
  );
}
