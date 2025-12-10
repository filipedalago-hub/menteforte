import { Target, Award, TrendingUp, Calendar } from 'lucide-react';
import { Goal } from '../../types/goals';

interface GoalsStatsProps {
  goals: Goal[];
}

export function GoalsStats({ goals }: GoalsStatsProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const activeGoals = goals.filter((g) => g.status === 'active').length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const overdueGoals = goals.filter(
    (g) => g.status === 'active' && g.deadline && new Date(g.deadline) < new Date()
  ).length;

  const stats = [
    {
      icon: Target,
      label: 'Total de Metas',
      value: totalGoals,
      color: 'text-primary bg-primary/10',
    },
    {
      icon: Award,
      label: 'Concluídas',
      value: completedGoals,
      color: 'text-green-400 bg-green-400/10',
    },
    {
      icon: TrendingUp,
      label: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      color: 'text-neon-cyan bg-neon-cyan/10',
    },
    {
      icon: Calendar,
      label: 'Ativas',
      value: activeGoals,
      color: 'text-blue-400 bg-blue-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="card-dark">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-soft-white">{stat.value}</p>
              <p className="text-sm text-soft-gray">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
