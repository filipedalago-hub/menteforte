import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles, ChevronRight, Flame, Award, Target, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Trilha, UserBadge } from '../lib/supabase';
import { MainLayout } from '../components/layout';
import { PremiumCard } from '../components/ui/PremiumCard';
import { TitleLG, TitleMD, Body, Caption } from '../components/Typography';
import { SkeletonList } from '../components/SkeletonLoader';
import { EmotionalFeedback } from '../components/EmotionalFeedback';
import { MoodTracker } from '../components/MoodTracker';
import { DailyInsight } from '../components/DailyInsight';
import { EnhancedXPBar } from '../components/gamification/EnhancedXPBar';
import { useEmotionalFeedback } from '../hooks/useEmotionalFeedback';
import { usePremiumToast } from '../hooks/usePremiumToast';
import { PremiumToast } from '../components/PremiumToast';
import { haptics } from '../lib/haptics';
import { SafeSection } from '../components/SafeSection';
import { StatCard } from '../components/StatCard';

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
  const [currentStreak, setCurrentStreak] = useState(0);
  const toast = usePremiumToast();

  const {
    showMoodTracker,
    showDailyInsight,
    currentMessage,
    dailyInsight,
    handleMoodSubmit,
    setShowMoodTracker,
    setShowDailyInsight,
    dismissMessage,
  } = useEmotionalFeedback(user?.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      const [trilhasRes, badgesRes, progressRes] = await Promise.all([
        supabase.from('trilhas').select('*').order('order_index'),
        supabase
          .from('user_badges')
          .select('*, badge:badges(*)')
          .eq('user_id', profile.id)
          .order('earned_at', { ascending: false })
          .limit(3),
        supabase
          .from('user_exercise_progress')
          .select('completed')
          .eq('user_id', profile.id)
          .eq('completed', true),
      ]);

      if (trilhasRes.data) setTrilhas(trilhasRes.data);
      if (badgesRes.data) setBadges(badgesRes.data as any);
      if (progressRes.data) setTotalExercisesCompleted(progressRes.data.length);

      setCurrentStreak(profile.streak || 0);
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const motivationalQuotes = [
    'Cada passo conta na sua jornada de transformação',
    'Você está mais forte do que imagina',
    'O progresso vem da consistência, não da perfeição',
    'Sua mente é o seu maior poder',
    'Transforme pensamentos em ações',
  ];

  const todayQuote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

  if (loading) {
    return (
      <MainLayout>
        <SkeletonList count={4} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PremiumToast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={toast.hide}
      />

      <SafeSection sectionName="MoodTracker" fallbackMessage="">
        <MoodTracker
          isOpen={showMoodTracker}
          onClose={() => setShowMoodTracker(false)}
          onSubmit={handleMoodSubmit}
        />
      </SafeSection>

      <SafeSection sectionName="DailyInsight" fallbackMessage="">
        <DailyInsight
          isOpen={showDailyInsight}
          onClose={() => setShowDailyInsight(false)}
          insight={dailyInsight}
        />
      </SafeSection>

      <SafeSection sectionName="EmotionalFeedback" fallbackMessage="">
        {currentMessage && (
          <EmotionalFeedback
            message={currentMessage.message}
            type={currentMessage.type}
            onDismiss={dismissMessage}
          />
        )}
      </SafeSection>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <TitleLG animated className="mb-2">
            Olá, {profile?.display_name || 'Guerreiro'}! 👋
          </TitleLG>
          <Body animated className="text-soft-gray">
            {todayQuote}
          </Body>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SafeSection sectionName="XP Card" fallbackMessage="XP indisponível">
            <StatCard
              icon={Zap}
              label="XP Total"
              value={profile?.xp}
              color="text-primary"
              bgColor="bg-primary/20"
              delay={0.1}
              fallbackValue={0}
            />
          </SafeSection>

          <SafeSection sectionName="Streak Card" fallbackMessage="Streak indisponível">
            <StatCard
              icon={Flame}
              label="Sequência"
              value={currentStreak >= 0 ? `${currentStreak} dias` : null}
              color="text-orange-400"
              bgColor="bg-gradient-to-r from-orange-500/20 to-red-500/20"
              delay={0.2}
              fallbackValue="0 dias"
            />
          </SafeSection>

          <SafeSection sectionName="Badges Card" fallbackMessage="Badges indisponíveis">
            <StatCard
              icon={Award}
              label="Badges"
              value={badges?.length}
              color="text-accent"
              bgColor="bg-accent/20"
              delay={0.3}
              fallbackValue={0}
            />
          </SafeSection>

          <SafeSection sectionName="Exercises Card" fallbackMessage="Exercícios indisponíveis">
            <StatCard
              icon={Target}
              label="Exercícios"
              value={totalExercisesCompleted}
              color="text-green-400"
              bgColor="bg-green-500/20"
              delay={0.4}
              fallbackValue={0}
            />
          </SafeSection>
        </div>

        <SafeSection sectionName="XP Progress Bar" fallbackMessage="Progresso indisponível">
          <PremiumCard variant="glow" padding="lg" className="mb-8" interactive={false}>
            <div className="flex items-center justify-between mb-4">
              <TitleMD>Seu Progresso</TitleMD>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp className="w-5 h-5 text-accent" />
              </motion.div>
            </div>
            <EnhancedXPBar currentXP={profile?.xp || 0} showDetails />
          </PremiumCard>
        </SafeSection>

        <SafeSection sectionName="Trilhas" fallbackMessage="Erro ao carregar trilhas">
          <div className="mb-6">
            <TitleMD className="mb-4">Suas Trilhas</TitleMD>
          </div>

          {trilhas && trilhas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trilhas.map((trilha, index) => {
                const IconComponent = ICON_MAP[trilha?.icon_name] || Brain;
                return (
                  <Link
                    key={trilha?.id || index}
                    to={`/app/trilha/${trilha?.slug || ''}`}
                    onClick={() => haptics.light()}
                  >
                    <PremiumCard
                      variant="glass"
                      padding="lg"
                      glowColor="#00AEEF"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <motion.div
                          className="p-4 bg-primary/20 rounded-2xl"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="w-8 h-8 text-primary" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-soft-white mb-2">
                            {trilha?.name || 'Trilha sem nome'}
                          </h3>
                          <Caption>{trilha?.description || 'Sem descrição'}</Caption>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <Caption>Explorar trilha</Caption>
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </div>
                    </PremiumCard>
                  </Link>
                );
              })}
            </div>
          ) : (
            <PremiumCard variant="glass" padding="lg">
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                <p className="text-soft-gray">Nenhuma trilha disponível no momento</p>
              </div>
            </PremiumCard>
          )}
        </SafeSection>

        {badges && badges.length > 0 && (
          <SafeSection sectionName="Badges" fallbackMessage="Erro ao carregar conquistas">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <TitleMD className="mb-4">Conquistas Recentes</TitleMD>
              <div className="grid grid-cols-3 gap-4">
                {badges.slice(0, 3).map((userBadge: any, index: number) => (
                  <PremiumCard
                    key={userBadge?.id || index}
                    variant="glass"
                    padding="md"
                    interactive={false}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                  >
                    <div className="text-center">
                      <motion.div
                        className="inline-flex p-4 bg-accent/20 rounded-2xl mb-3"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Award className="w-8 h-8 text-accent" />
                      </motion.div>
                      <p className="text-sm font-semibold text-soft-white mb-1">
                        {userBadge?.badge?.name || 'Badge'}
                      </p>
                      <Caption className="line-clamp-2">
                        {userBadge?.badge?.description || 'Conquista desbloqueada'}
                      </Caption>
                    </div>
                  </PremiumCard>
                ))}
              </div>
            </motion.div>
          </SafeSection>
        )}
      </motion.div>
    </MainLayout>
  );
}
