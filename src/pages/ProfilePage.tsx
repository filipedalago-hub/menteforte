import React, { useEffect, useState } from 'react';
import { Award, Flame, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, UserBadge } from '../lib/supabase';
import { xpProgress } from '../utils/gamification';
import { ProgressBar } from '../components/ProgressBar';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Flame,
  Zap,
  TrendingUp,
};

export function ProfilePage() {
  const { profile } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [exercisesCompleted, setExercisesCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      const [badgesRes, progressRes] = await Promise.all([
        supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', profile.id)
          .order('earned_at', { ascending: false }),
        supabase
          .from('user_exercise_progress')
          .select('id')
          .eq('user_id', profile.id)
          .eq('completed', true),
      ]);

      if (badgesRes.data) setBadges(badgesRes.data as any);
      if (progressRes.data) setExercisesCompleted(progressRes.data.length);
    };

    fetchData();
  }, [profile]);

  if (!profile) return null;

  const progress = xpProgress(profile.xp);

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">{profile.display_name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-blue-900">{profile.xp}</p>
            <p className="text-sm text-gray-600">XP Total</p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-green-900">{profile.level}</p>
            <p className="text-sm text-gray-600">Nível</p>
          </div>

          <div className="text-center p-6 bg-orange-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <p className="text-3xl font-bold text-orange-900">{profile.current_streak}</p>
            <p className="text-sm text-gray-600">Dias de Sequência</p>
          </div>
        </div>

        <div className="mt-6">
          <ProgressBar
            percentage={progress.percentage}
            label={`Próximo nível: ${progress.currentLevelXp} / ${progress.nextLevelXp} XP`}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <h2 className="text-xl font-bold mb-6">Estatísticas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Award className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{exercisesCompleted}</p>
              <p className="text-sm text-gray-600">Exercícios Completados</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Flame className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold">{profile.longest_streak}</p>
              <p className="text-sm text-gray-600">Maior Sequência</p>
            </div>
          </div>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-6">Conquistas Desbloqueadas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((userBadge) => {
              const badge = userBadge.badge;
              if (!badge) return null;
              const Icon = ICON_MAP[badge.icon_name] || Award;

              return (
                <div
                  key={userBadge.id}
                  className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200"
                >
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-8 h-8 text-yellow-900" />
                  </div>
                  <p className="font-semibold text-sm mb-1">{badge.name}</p>
                  <p className="text-xs text-gray-600">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
