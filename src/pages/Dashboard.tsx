import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Sparkles, ChevronRight, Flame, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Trilha, UserBadge } from '../lib/supabase';
import { CardSkeleton } from '../components/Skeleton';
import { EmotionalFeedback } from '../components/EmotionalFeedback';
import { MoodTracker } from '../components/MoodTracker';
import { DailyInsight } from '../components/DailyInsight';
import { GamificationPanel } from '../components/GamificationPanel';
import { useEmotionalFeedback } from '../hooks/useEmotionalFeedback';
import { EmotionalIntelligenceEngine } from '../lib/emotionalIntelligence';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Zap,
  Sparkles,
};

export function Dashboard() {
  const { profile, user } = useAuth();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExercisesCompleted, setTotalExercisesCompleted] = useState(0);

  const {
    showMoodTracker,
    showDailyInsight,
    currentMessage,
    dailyInsight,
    handleMoodSubmit,
    setShowMoodTracker,
    setShowDailyInsight,
    dismissMessage,
    userContext
  } = useEmotionalFeedback(user?.id);

  useEffect(() => {
    const fetchData = async () => {
      const [trilhasRes, badgesRes, progressRes] = await Promise.all([
        supabase.from('trilhas').select('*').order('order_index'),
        profile
          ? supabase
              .from('user_badges')
              .select('*, badge:badges(*)')
              .eq('user_id', profile.id)
              .order('earned_at', { ascending: false })
          : Promise.resolve({ data: [], error: null }),
        profile
          ? supabase
              .from('user_exercise_progress')
              .select('completed')
              .eq('user_id', profile.id)
              .eq('completed', true)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (trilhasRes.data) setTrilhas(trilhasRes.data);
      if (badgesRes.data) setBadges(badgesRes.data as any);
      if (progressRes.data) setTotalExercisesCompleted(progressRes.data.length);
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Suas Trilhas</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const consistencyScore = userContext
    ? EmotionalIntelligenceEngine.calculateConsistencyScore(
        profile?.current_streak || 0,
        profile?.longest_streak || 0,
        profile?.total_sessions || 0,
        30
      )
    : 0;

  return (
    <div>
      {showMoodTracker && (
        <MoodTracker
          onSubmit={handleMoodSubmit}
          onSkip={() => setShowMoodTracker(false)}
          context="session_start"
        />
      )}

      {showDailyInsight && dailyInsight && (
        <DailyInsight
          insight={dailyInsight}
          onRead={() => setShowDailyInsight(false)}
        />
      )}

      {currentMessage && (
        <EmotionalFeedback
          message={currentMessage}
          onDismiss={dismissMessage}
        />
      )}

      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 responsive-text">Olá, {profile?.display_name}!</h1>
        <p className="text-gray-600 responsive-text">Continue sua jornada de transformação mental</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 px-4 md:px-0">
        <div className="lg:col-span-2 space-y-6">
          {profile && profile.current_streak > 0 && (
            <div className="bg-gradient-to-r from-accent-orange/10 to-accent-gold/20 border border-accent-orange/30 rounded-xl p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent-orange/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Flame className="w-6 h-6 md:w-8 md:h-8 text-accent-orange" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 responsive-text">
                    {profile.current_streak} {profile.current_streak === 1 ? 'dia' : 'dias'} de sequência!
                  </h2>
                  <p className="text-sm md:text-base text-gray-700 responsive-text">Continue assim! Seu recorde é {profile.longest_streak} dias.</p>
                </div>
              </div>
            </div>
          )}

          {badges.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Conquistas Recentes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {badges.slice(0, 4).map((userBadge) => {
                  const badge = userBadge.badge;
                  if (!badge) return null;
                  const Icon = ICON_MAP[badge.icon_name] || Award;

                  return (
                    <div
                      key={userBadge.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 text-center"
                    >
                      <div className="w-12 h-12 bg-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon className="w-6 h-6 text-accent-gold" />
                      </div>
                      <p className="font-semibold text-sm">{badge.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          {profile && (
            <GamificationPanel
              xp={profile.xp}
              level={profile.level}
              streak={profile.current_streak}
              longestStreak={profile.longest_streak}
              totalExercises={totalExercisesCompleted}
              consistencyScore={consistencyScore}
            />
          )}
        </div>
      </div>

      <div className="mb-6 md:mb-8 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 responsive-text">Suas Trilhas de Aprendizado</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {trilhas.map((trilha) => {
            const Icon = ICON_MAP[trilha.icon_name] || Brain;

            return (
              <Link
                key={trilha.id}
                to={`/app/trilha/${trilha.slug}`}
                className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition-all group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 group-hover:text-primary transition-colors responsive-text">
                  {trilha.name}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 responsive-text">{trilha.description}</p>
                <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all text-sm md:text-base">
                  Começar
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 md:p-6 mx-4 md:mx-0">
        <h2 className="text-lg md:text-xl font-bold mb-2 responsive-text">Trilha Diária Recomendada</h2>
        <p className="text-sm md:text-base text-gray-700 mb-4 responsive-text">
          Complete pelo menos um exercício por dia para manter sua sequência e maximizar seu progresso.
        </p>
        <Link
          to="/app/trilha/fundamentos-mentais"
          className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm md:text-base"
        >
          Ver Exercício do Dia
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </Link>
      </div>
    </div>
  );
}
