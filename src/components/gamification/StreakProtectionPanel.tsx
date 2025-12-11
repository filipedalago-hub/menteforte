import { useState, useEffect } from 'react';
import { Shield, Flame, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getStreakProtection,
  useStreakFreeze,
  checkStreakStatus,
  StreakProtectionData,
} from '../../lib/streakProtection';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { usePremiumToast } from '../../hooks/usePremiumToast';

export function StreakProtectionPanel() {
  const { user, profile } = useAuth();
  const { showToast } = usePremiumToast();
  const [protection, setProtection] = useState<StreakProtectionData | null>(null);
  const [status, setStatus] = useState<{
    needsProtection: boolean;
    daysUntilLoss: number;
    canAutoProtect: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const [protectionData, statusData] = await Promise.all([
        getStreakProtection(user.id),
        checkStreakStatus(user.id),
      ]);
      setProtection(protectionData);
      setStatus(statusData);
      setLoading(false);
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const handleUseFreeze = async () => {
    if (!user) return;

    const result = await useStreakFreeze(user.id);

    if (result) {
      showToast('Streak congelado! Você está protegido por hoje.', 'success');
      const [protectionData, statusData] = await Promise.all([
        getStreakProtection(user.id),
        checkStreakStatus(user.id),
      ]);
      setProtection(protectionData);
      setStatus(statusData);
    } else {
      showToast('Não foi possível usar o congelamento de streak', 'error');
    }
  };

  if (loading || !protection || !status || !profile) return null;

  const currentStreak = profile.current_streak || 0;

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/40">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-soft-white">Proteção de Streak</h3>
            <p className="text-sm text-soft-muted">Mantenha sua sequência segura</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{protection.freezesAvailable}</div>
          <div className="text-xs text-soft-muted">Congelamentos</div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-dark-lighter rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="w-8 h-8 text-neon-cyan" />
          <div>
            <div className="text-2xl font-bold text-soft-white">{currentStreak} dias</div>
            <div className="text-sm text-soft-muted">Streak atual</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {status.needsProtection && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-400 mb-1">Atenção: Streak em risco!</h4>
                <p className="text-sm text-red-400/80 mb-3">
                  {status.daysUntilLoss === 0
                    ? 'Seu streak será perdido se você não completar uma atividade hoje!'
                    : `Você tem ${status.daysUntilLoss} dia(s) para completar uma atividade.`}
                </p>

                {status.canAutoProtect && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleUseFreeze}
                    disabled={!protection.canUseFreeze}
                  >
                    <Shield className="w-4 h-4" />
                    Usar Congelamento de Streak
                  </Button>
                )}

                {!status.canAutoProtect && (
                  <p className="text-xs text-red-400">
                    Você não tem congelamentos disponíveis. Complete atividades para ganhar mais!
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg">
          <span className="text-sm text-soft-muted">Congelamentos disponíveis</span>
          <span className="text-sm font-semibold text-soft-white">
            {protection.freezesAvailable}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg">
          <span className="text-sm text-soft-muted">Congelamentos usados</span>
          <span className="text-sm font-semibold text-soft-white">
            {protection.freezesUsed}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-titanium/30">
        <h4 className="font-semibold text-soft-white mb-3">Como funciona?</h4>
        <ul className="space-y-2 text-sm text-soft-muted">
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Use um congelamento para proteger seu streak em dias inativos
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Flame className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
            <span>
              Ganhe congelamentos completando desafios e mantendo streaks longos
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Congelamentos são aplicados automaticamente quando seu streak está em risco
            </span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
