import { useState, useEffect } from 'react';
import { Plus, Target, TrendingUp, Award, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Goal, CreateGoalInput, UpdateGoalInput, GoalStatus } from '../types/goals';
import { HabitWithStats, CreateHabitInput } from '../types/habits';
import { GoalCard } from '../components/goals/GoalCard';
import { GoalForm } from '../components/goals/GoalForm';
import { HabitCard } from '../components/habits/HabitCard';
import { HabitForm } from '../components/habits/HabitForm';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import * as goalsApi from '../utils/goalsApi';
import * as habitsApi from '../utils/habitsApi';

export function GoalsPage() {
  const { profile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'goals' | 'habits'>('habits');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<HabitWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<GoalStatus | 'all'>('active');

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const [goalsData, habitsData] = await Promise.all([
        goalsApi.fetchGoals(profile.id),
        habitsApi.fetchHabitsWithStats(profile.id),
      ]);
      setGoals(goalsData);
      setHabits(habitsData);
    } catch (error) {
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (input: CreateGoalInput) => {
    if (!profile) return;

    try {
      const newGoal = await goalsApi.createGoal(profile.id, input);
      setGoals([newGoal, ...goals]);
      setShowGoalForm(false);
      showToast('Meta criada com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao criar meta', 'error');
    }
  };

  const handleUpdateGoalProgress = async (goalId: string, value: number) => {
    try {
      const updatedGoal = await goalsApi.updateGoalProgress(goalId, value);
      setGoals(goals.map((g) => (g.id === goalId ? updatedGoal : g)));
      showToast('Progresso atualizado!', 'success');
    } catch (error) {
      showToast('Erro ao atualizar progresso', 'error');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const completedGoal = await goalsApi.completeGoal(goalId);
      setGoals(goals.map((g) => (g.id === goalId ? completedGoal : g)));
      showToast('Meta concluída! +10 XP', 'success');
    } catch (error) {
      showToast('Erro ao completar meta', 'error');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;

    try {
      await goalsApi.deleteGoal(goalId);
      setGoals(goals.filter((g) => g.id !== goalId));
      showToast('Meta excluída', 'success');
    } catch (error) {
      showToast('Erro ao excluir meta', 'error');
    }
  };

  const handleCreateHabit = async (input: CreateHabitInput) => {
    if (!profile) return;

    try {
      await habitsApi.createHabit(profile.id, input);
      await loadData();
      setShowHabitForm(false);
      showToast('Hábito criado com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao criar hábito', 'error');
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    if (!profile) return;

    try {
      await habitsApi.completeHabit(profile.id, habitId);
      await loadData();
      showToast('Hábito concluído! +5 XP', 'success');
    } catch (error) {
      showToast('Erro ao completar hábito', 'error');
    }
  };

  const handleUncompleteHabit = async (habitId: string) => {
    try {
      await habitsApi.uncompleteHabit(habitId);
      await loadData();
      showToast('Hábito desmarcado', 'success');
    } catch (error) {
      showToast('Erro ao desmarcar hábito', 'error');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return;

    try {
      await habitsApi.deleteHabit(habitId);
      setHabits(habits.filter((h) => h.id !== habitId));
      showToast('Hábito excluído', 'success');
    } catch (error) {
      showToast('Erro ao excluir hábito', 'error');
    }
  };

  const filteredGoals = goals.filter((goal) =>
    filterStatus === 'all' ? true : goal.status === filterStatus
  );

  const stats = {
    totalGoals: goals.length,
    completedGoals: goals.filter((g) => g.status === 'completed').length,
    activeHabits: habits.filter((h) => h.active).length,
    avgCompletionRate: habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + h.completion_rate, 0) / habits.length)
      : 0,
  };

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-soft-white mb-2">Metas e Hábitos</h1>
          <p className="text-soft-gray">
            Defina suas metas e construa hábitos poderosos para transformar sua vida
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-dark">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white">{stats.totalGoals}</p>
                <p className="text-sm text-soft-gray">Metas</p>
              </div>
            </div>
          </div>

          <div className="card-dark">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-400/20 rounded-lg">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white">{stats.completedGoals}</p>
                <p className="text-sm text-soft-gray">Concluídas</p>
              </div>
            </div>
          </div>

          <div className="card-dark">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-neon-cyan/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white">{stats.activeHabits}</p>
                <p className="text-sm text-soft-gray">Hábitos Ativos</p>
              </div>
            </div>
          </div>

          <div className="card-dark">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-400/20 rounded-lg">
                <Filter className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-soft-white">{stats.avgCompletionRate}%</p>
                <p className="text-sm text-soft-gray">Taxa Média</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'habits'
                  ? 'bg-primary text-dark shadow-glow-sm'
                  : 'bg-titanium/20 text-soft-gray hover:text-soft-white'
              }`}
            >
              Hábitos
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'goals'
                  ? 'bg-primary text-dark shadow-glow-sm'
                  : 'bg-titanium/20 text-soft-gray hover:text-soft-white'
              }`}
            >
              Metas
            </button>
          </div>

          <button
            onClick={() => activeTab === 'goals' ? setShowGoalForm(true) : setShowHabitForm(true)}
            className="btn-primary ml-auto flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'goals' ? 'Nova Meta' : 'Novo Hábito'}
          </button>
        </div>

        {activeTab === 'goals' && (
          <div className="mb-6 flex gap-2">
            {(['all', 'active', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
                    : 'bg-titanium/20 text-soft-gray hover:text-soft-white'
                }`}
              >
                {status === 'all' ? 'Todas' : status === 'active' ? 'Ativas' : 'Concluídas'}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'habits' ? (
              habits.length > 0 ? (
                habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onComplete={handleCompleteHabit}
                    onUncomplete={handleUncompleteHabit}
                    onEdit={() => {}}
                    onDelete={handleDeleteHabit}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <Target className="w-16 h-16 text-titanium mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-soft-white mb-2">
                    Nenhum hábito ainda
                  </h3>
                  <p className="text-soft-gray mb-6">
                    Crie seu primeiro hábito e comece sua jornada de transformação
                  </p>
                  <button onClick={() => setShowHabitForm(true)} className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Primeiro Hábito
                  </button>
                </div>
              )
            ) : filteredGoals.length > 0 ? (
              filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={() => {}}
                  onDelete={handleDeleteGoal}
                  onUpdateProgress={handleUpdateGoalProgress}
                  onComplete={handleCompleteGoal}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <Target className="w-16 h-16 text-titanium mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-soft-white mb-2">
                  Nenhuma meta encontrada
                </h3>
                <p className="text-soft-gray mb-6">
                  Defina suas metas e comece a alcançar seus objetivos
                </p>
                <button onClick={() => setShowGoalForm(true)} className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeira Meta
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showGoalForm && (
        <GoalForm onSubmit={handleCreateGoal} onCancel={() => setShowGoalForm(false)} />
      )}

      {showHabitForm && (
        <HabitForm onSubmit={handleCreateHabit} onCancel={() => setShowHabitForm(false)} />
      )}
    </div>
  );
}
