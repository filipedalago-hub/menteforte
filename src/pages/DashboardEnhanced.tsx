import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Heart, Target, Users, BookOpen, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { TitleLG, TitleMD, Caption } from '../components/Typography';
import { PremiumCard } from '../components/ui/PremiumCard';
import { AnimatedXPBar } from '../components/gamification/AnimatedXPBar';
import { LivesDisplay } from '../components/gamification/LivesDisplay';
import { LeagueDisplay } from '../components/gamification/LeagueDisplay';
import { DailyChallengesPanel } from '../components/gamification/DailyChallengesPanel';
import { StreakProtectionPanel } from '../components/gamification/StreakProtectionPanel';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { haptics } from '../lib/haptics';
import { useState } from 'react';
import { supabase, Trilha } from '../lib/supabase';

const ICON_MAP: Record<string, any> = {
  Brain,
  Heart,
  Target,
  Users,
  BookOpen,
};

export function DashboardEnhanced() {
  const { user, profile } = useAuth();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);

  useEffect(() => {
    const fetchTrilhas = async () => {
      const { data } = await supabase
        .from('trilhas')
        .select('*')
        .order('order_index');

      if (data) {
        setTrilhas(data);
      }
    };

    fetchTrilhas();
  }, []);

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="space-y-8 px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <TitleLG className="mb-2">
          Olá, {profile.display_name}!
        </TitleLG>
        <Caption>Continue sua jornada de transformação</Caption>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <PremiumCard variant="glass" padding="lg">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <TitleMD>Seu Progresso</TitleMD>
              <StreakDisplay streak={profile.current_streak} compact />
            </div>
          </div>
          <AnimatedXPBar xp={profile.xp} showDetails />
        </PremiumCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyChallengesPanel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StreakProtectionPanel />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <LeagueDisplay />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="mb-6">
          <TitleMD className="mb-4">Suas Trilhas</TitleMD>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trilhas.map((trilha, index) => {
            const IconComponent = ICON_MAP[trilha.icon_name] || Brain;
            return (
              <Link
                key={trilha.id}
                to={`/app/trilha/${trilha.slug}`}
                onClick={() => haptics.light()}
              >
                <PremiumCard
                  variant="glass"
                  padding="lg"
                  glowColor="#00AEEF"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
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
                        {trilha.name}
                      </h3>
                      <Caption>{trilha.description}</Caption>
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
      </motion.div>
    </div>
  );
}
