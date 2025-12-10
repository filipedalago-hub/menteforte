import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, CheckCircle, Circle } from 'lucide-react';
import { supabase, Trilha, Pilar, Exercise, UserExerciseProgress } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CardSkeleton } from '../components/Skeleton';
import { ProgressBar } from '../components/ProgressBar';
import { useAuth } from '../contexts/AuthContext';

export function PilarPage() {
  const { trilhaSlug, pilarSlug } = useParams<{ trilhaSlug: string; pilarSlug: string }>();
  const { profile } = useAuth();
  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [pilar, setPilar] = useState<Pilar | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [progress, setProgress] = useState<Map<string, UserExerciseProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!trilhaSlug || !pilarSlug) return;

      const trilhaRes = await supabase
        .from('trilhas')
        .select('*')
        .eq('slug', trilhaSlug)
        .maybeSingle();

      if (!trilhaRes.data) {
        setLoading(false);
        return;
      }

      setTrilha(trilhaRes.data);

      const pilarRes = await supabase
        .from('pilares')
        .select('*')
        .eq('trilha_id', trilhaRes.data.id)
        .eq('slug', pilarSlug)
        .maybeSingle();

      if (!pilarRes.data) {
        setLoading(false);
        return;
      }

      setPilar(pilarRes.data);

      const exercisesRes = await supabase
        .from('exercises')
        .select('*')
        .eq('pilar_id', pilarRes.data.id)
        .order('order_index');

      if (exercisesRes.data) {
        setExercises(exercisesRes.data);

        if (profile) {
          const progressRes = await supabase
            .from('user_exercise_progress')
            .select('*')
            .eq('user_id', profile.id)
            .in('exercise_id', exercisesRes.data.map(e => e.id));

          if (progressRes.data) {
            const progressMap = new Map();
            progressRes.data.forEach(p => progressMap.set(p.exercise_id, p));
            setProgress(progressMap);
          }
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [trilhaSlug, pilarSlug, profile]);

  if (loading) {
    return (
      <div>
        <div className="h-6 w-64 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!trilha || !pilar) {
    return <div>Conteúdo não encontrado</div>;
  }

  const completedCount = Array.from(progress.values()).filter(p => p.completed).length;
  const totalCount = exercises.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Início', path: '/app' },
          { label: trilha.name, path: `/app/trilha/${trilhaSlug}` },
          { label: pilar.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{pilar.name}</h1>
        <p className="text-gray-600 text-lg mb-6">{pilar.description}</p>
        <ProgressBar
          percentage={completionPercentage}
          label={`${completedCount} de ${totalCount} exercícios concluídos`}
        />
      </div>

      <div className="space-y-4">
        {exercises.map((exercise) => {
          const exerciseProgress = progress.get(exercise.id);
          const isCompleted = exerciseProgress?.completed || false;

          return (
            <Link
              key={exercise.id}
              to={`/app/trilha/${trilhaSlug}/${pilarSlug}/exercicios/${exercise.slug}`}
              className="block bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Circle className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 transition-colors">
                        {exercise.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{exercise.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">+{exercise.xp_reward} XP</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {exercises.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum exercício disponível ainda.
        </div>
      )}
    </div>
  );
}
