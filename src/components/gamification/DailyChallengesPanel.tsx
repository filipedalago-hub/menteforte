import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDailyChallenges,
  claimChallengeReward,
  ChallengeWithProgress,
  getDifficultyColor,
} from '../../lib/dailyChallenges';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePremiumToast } from '../../hooks/usePremiumToast';

export function DailyChallengesPanel() {
  const { user } = useAuth();
  const { showToast } = usePremiumToast();
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchChallenges = async () => {
      setLoading(true);
      const data = await getDailyChallenges(user.id);
      setChallenges(data);
      setLoading(false);
    };

    fetchChallenges();

    const interval = setInterval(fetchChallenges, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleClaimReward = async (challengeId: string) => {
    if (!user) return;

    const result = await claimChallengeReward(user.id, challengeId);

    if (result.success) {
      showToast(`Você ganhou ${result.xpAwarded} XP!`, 'success');
      const updated = await getDailyChallenges(user.id);
      setChallenges(updated);
    } else {
      showToast('Erro ao resgatar recompensa', 'error');
    }
  };

  if (loading) {
    return (
      <Card variant="glass" padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-titanium/30 rounded w-1/2" />
          <div className="h-20 bg-titanium/30 rounded" />
          <div className="h-20 bg-titanium/30 rounded" />
        </div>
      </Card>
    );
  }

  const completedChallenges = challenges.filter(c => c.isCompleted).length;
  const totalChallenges = challenges.length;

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/20 rounded-xl border border-accent/40">
            <Trophy className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-soft-white">Desafios Diários</h3>
            <p className="text-sm text-soft-muted">
              {completedChallenges}/{totalChallenges} completos
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Reinicia à meia-noite</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {challenges.map((challenge, index) => {
            const progressPercentage = Math.min(
              (challenge.progress / challenge.requirementValue) * 100,
              100
            );

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl border ${
                  challenge.isCompleted
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-dark-lighter/50 border-titanium/30'
                } p-4 transition-all hover:scale-[1.02]`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-soft-white">{challenge.title}</h4>
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded-full"
                          style={{
                            backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                            color: getDifficultyColor(challenge.difficulty),
                          }}
                        >
                          {challenge.difficulty === 'easy' ? 'Fácil' : challenge.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </span>
                      </div>
                      <p className="text-sm text-soft-muted">{challenge.description}</p>
                    </div>

                    {challenge.isCompleted && (
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-soft-muted">
                        Progresso: {challenge.progress}/{challenge.requirementValue}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                    <div className="h-2 bg-dark rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          challenge.isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : 'bg-gradient-primary'
                        }`}
                      />
                    </div>
                  </div>

                  {challenge.isCompleted && !challenge.rewardClaimed && (
                    <Button
                      variant="neon"
                      size="sm"
                      fullWidth
                      onClick={() => handleClaimReward(challenge.id)}
                    >
                      <Zap className="w-4 h-4" />
                      Resgatar Recompensa
                    </Button>
                  )}

                  {challenge.rewardClaimed && (
                    <div className="text-center py-2 px-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <span className="text-sm text-green-400 font-medium">
                        Recompensa resgatada!
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {completedChallenges === totalChallenges && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-accent/20 to-primary/20 border border-primary/40 rounded-xl text-center"
        >
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <h4 className="font-bold text-soft-white mb-1">Todos os desafios completos!</h4>
          <p className="text-sm text-soft-muted">
            Parabéns! Volte amanhã para novos desafios.
          </p>
        </motion.div>
      )}
    </Card>
  );
}
