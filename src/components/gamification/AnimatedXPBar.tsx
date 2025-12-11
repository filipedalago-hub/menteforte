import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import { xpProgress } from '../../utils/gamificationSystem';

interface AnimatedXPBarProps {
  xp: number;
  showDetails?: boolean;
  compact?: boolean;
}

export function AnimatedXPBar({ xp, showDetails = true, compact = false }: AnimatedXPBarProps) {
  const progress = xpProgress(xp);
  const controls = useAnimation();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const prevXpRef = useRef(xp);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 },
      });

      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 40,
      }));
      setParticles(newParticles);

      setTimeout(() => setParticles([]), 1000);
    }
    prevXpRef.current = xp;
  }, [xp, controls]);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-dark rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-primary rounded-full relative"
            style={{
              boxShadow: '0 0 12px rgba(0, 174, 239, 0.6)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <span className="text-primary">Nv {progress.currentLevel}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={controls}
      className="relative"
    >
      {showDetails && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-soft-white">
                Nível {progress.currentLevel}
              </div>
              <div className="text-xs text-soft-muted">
                {progress.xpInCurrentLevel}/{progress.xpNeededForLevel} XP
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-primary">{xp} XP</div>
            <div className="text-xs text-soft-muted">
              {progress.xpNeededForLevel - progress.xpInCurrentLevel} até Nv {progress.nextLevel}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="h-4 bg-dark rounded-full overflow-hidden relative border border-primary/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary via-neon-cyan to-primary rounded-full relative"
            style={{
              boxShadow: '0 0 16px rgba(0, 174, 239, 0.8)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Zap className="w-4 h-4 text-primary" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 0, x: `${particle.x}%`, y: 0 }}
            animate={{
              opacity: 0,
              scale: [0, 1, 0],
              y: -particle.y,
            }}
            transition={{ duration: 0.8 }}
            className="absolute top-0 w-2 h-2 bg-primary rounded-full"
            style={{
              boxShadow: '0 0 8px rgba(0, 174, 239, 0.8)',
            }}
          />
        ))}
      </div>

      {showDetails && progress.percentage >= 80 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center"
        >
          <p className="text-xs text-primary font-medium animate-pulse">
            Quase subindo de nível! Continue assim!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
