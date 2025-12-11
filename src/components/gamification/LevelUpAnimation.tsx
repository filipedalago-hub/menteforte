import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { haptics } from '../../lib/haptics';

interface LevelUpAnimationProps {
  isVisible: boolean;
  level: number;
  onComplete: () => void;
}

export function LevelUpAnimation({ isVisible, level, onComplete }: LevelUpAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      haptics.success();
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-dark border-2 border-accent rounded-3xl p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <Sparkles className="w-12 h-12 text-accent mx-auto mb-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-soft-white mb-2"
              >
                Parabéns!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-soft-gray mb-6"
              >
                Você alcançou o
              </motion.p>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full shadow-glow-accent mb-4"
              >
                <Star className="w-12 h-12 text-white fill-white" />
                <span className="absolute text-3xl font-bold text-white">
                  {level}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl font-semibold text-accent"
              >
                Nível {level}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm text-soft-muted mt-4"
              >
                Toque para continuar
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
