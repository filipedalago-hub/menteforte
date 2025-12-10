import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, Trilha, Pilar, Exercise, UserExerciseProgress } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import { ReflectionExercise } from '../components/exercises/ReflectionExercise';
import { MultipleChoiceExercise } from '../components/exercises/MultipleChoiceExercise';
import { RatingScaleExercise } from '../components/exercises/RatingScaleExercise';
import { ChecklistExercise } from '../components/exercises/ChecklistExercise';
import { FocusedAttentionExercise } from '../components/exercises/FocusedAttentionExercise';
import { BreathingExercise } from '../components/exercises/BreathingExercise';
import { GratitudeListExercise } from '../components/exercises/GratitudeListExercise';
import { PrayerReflectionExercise } from '../components/exercises/PrayerReflectionExercise';
import { MoralAssessmentExercise } from '../components/exercises/MoralAssessmentExercise';
import { Skeleton } from '../components/Skeleton';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';
import { checkStreak } from '../utils/gamification';

export function ExercisePage() {
  const { trilhaSlug, pilarSlug, exerciseSlug } = useParams();
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [pilar, setPilar] = useState<Pilar | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [progress, setProgress] = useState<UserExerciseProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!trilhaSlug || !pilarSlug || !exerciseSlug || !profile) return;

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

      const exerciseRes = await supabase
        .from('exercises')
        .select('*')
        .eq('pilar_id', pilarRes.data.id)
        .eq('slug', exerciseSlug)
        .maybeSingle();

      if (!exerciseRes.data) {
        setLoading(false);
        return;
      }
      setExercise(exerciseRes.data);

      const progressRes = await supabase
        .from('user_exercise_progress')
        .select('*')
        .eq('user_id', profile.id)
        .eq('exercise_id', exerciseRes.data.id)
        .maybeSingle();

      setProgress(progressRes.data);
      setLoading(false);
    };

    fetchData();
  }, [trilhaSlug, pilarSlug, exerciseSlug, profile]);

  const handleSave = async (answerData: any) => {
    if (!exercise || !profile) return;

    const progressData = {
      user_id: profile.id,
      exercise_id: exercise.id,
      answer_data: answerData,
      completed: false,
      last_updated: new Date().toISOString(),
    };

    if (progress) {
      await supabase
        .from('user_exercise_progress')
        .update(progressData)
        .eq('id', progress.id);
    } else {
      const { data } = await supabase
        .from('user_exercise_progress')
        .insert(progressData)
        .select()
        .single();
      if (data) setProgress(data);
    }
  };

  const handleComplete = async () => {
    if (!exercise || !profile) return;

    const now = new Date().toISOString();
    const streakUpdate = checkStreak(profile.last_activity_date);

    const progressData = {
      user_id: profile.id,
      exercise_id: exercise.id,
      completed: true,
      completed_at: now,
      last_updated: now,
      answer_data: progress?.answer_data || {},
    };

    if (progress) {
      await supabase
        .from('user_exercise_progress')
        .update(progressData)
        .eq('id', progress.id);
    } else {
      await supabase.from('user_exercise_progress').insert(progressData);
    }

    const newXp = profile.xp + exercise.xp_reward;
    const newStreak = streakUpdate.needsUpdate
      ? profile.current_streak + streakUpdate.streak
      : profile.current_streak;
    const newLongestStreak = Math.max(profile.longest_streak, newStreak);

    await supabase
      .from('profiles')
      .update({
        xp: newXp,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_activity_date: new Date().toISOString().split('T')[0],
        updated_at: now,
      })
      .eq('id', profile.id);

    await refreshProfile();

    showToast(`Parabéns! Você ganhou ${exercise.xp_reward} XP!`, 'success');

    setTimeout(() => {
      navigate(`/app/trilha/${trilhaSlug}/${pilarSlug}`);
    }, 1500);
  };

  const renderExercise = () => {
    if (!exercise || !profile) return null;

    const initialAnswer = progress?.answer_data;

    switch (exercise.type) {
      case 'reflection':
        return (
          <ReflectionExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoiceExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'rating_scale':
        return (
          <RatingScaleExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'checklist':
        return (
          <ChecklistExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'focused_attention':
        return (
          <FocusedAttentionExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'breathing':
        return (
          <BreathingExercise
            content={exercise.content}
            onComplete={handleComplete}
          />
        );

      case 'gratitude_list':
        return (
          <GratitudeListExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'prayer_reflection':
        return (
          <PrayerReflectionExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      case 'moral_assessment':
        return (
          <MoralAssessmentExercise
            content={exercise.content}
            initialAnswer={initialAnswer}
            onSave={handleSave}
            onComplete={handleComplete}
          />
        );

      default:
        return <div>Tipo de exercício não suportado</div>;
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="h-6 w-64 mb-6" />
        <Skeleton className="h-8 w-96 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!trilha || !pilar || !exercise) {
    return <div>Exercício não encontrado</div>;
  }

  return (
    <>
      <div className="responsive-container">
        <Breadcrumbs
          items={[
            { label: 'Início', path: '/app' },
            { label: trilha.name, path: `/app/trilha/${trilhaSlug}` },
            { label: pilar.name, path: `/app/trilha/${trilhaSlug}/${pilarSlug}` },
            { label: exercise.title },
          ]}
        />

        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 responsive-text">{exercise.title}</h1>
          <p className="text-gray-600 text-base md:text-lg responsive-text">{exercise.description}</p>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {renderExercise()}
        </div>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
