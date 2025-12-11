import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { xpProgress } from '../../utils/gamificationSystem';

interface EnhancedXPBarProps {
  currentXP: number;
  showDetails?: boolean;
  onLevelUp?: (newLevel: number) => void;
}

export function EnhancedXPBar({ currentXP, showDetails = true, onLevelUp }: EnhancedXPBarProps) {
  const progress = useMemo(() => xpProgress(currentXP), [currentXP]);

  return (
    <div className="w-full">
      {showDetails && (
        <div className="flex items-center justify-between mb-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-primary fill-primary" />
            </motion.div>
            <div>
              <p className="text-lg font-bold text-soft-white">
                Nível {progress.currentLevel}
              </p>
              <p className="text-xs text-soft-muted">
                {progress.xpInCurrentLevel.toLocaleString()} /{' '}
                {progress.xpNeededForLevel.toLocaleString()} XP
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 text-accent"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {Math.round(progress.percentage)}%
            </span>
          </motion.div>
        </div>
      )}

      <div className="relative h-4 bg-dark-lighter rounded-full overflow-hidden border border-titanium/30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent shadow-glow-primary relative overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: `${progress.percentage}%` }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
        </motion.div>
      </div>

      {showDetails && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-xs text-soft-muted text-right"
        >
          Faltam {(progress.xpNeededForLevel - progress.xpInCurrentLevel).toLocaleString()} XP para o próximo nível
        </motion.p>
      )}
    </div>
  );
}
