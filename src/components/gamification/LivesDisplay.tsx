import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserLives, formatTimeUntilNextLife, LivesData } from '../../lib/livesSystem';
import { useAuth } from '../../contexts/AuthContext';

export function LivesDisplay() {
  const { user } = useAuth();
  const [lives, setLives] = useState<LivesData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!user) return;

    const fetchLives = async () => {
      const livesData = await getUserLives(user.id);
      setLives(livesData);
    };

    fetchLives();

    const interval = setInterval(fetchLives, 30000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!lives || lives.currentLives >= lives.maxLives) return;

    const updateTimer = () => {
      if (lives.timeUntilNextLife <= 0) {
        if (user) {
          getUserLives(user.id).then(setLives);
        }
        return;
      }

      setTimeRemaining(formatTimeUntilNextLife(lives.timeUntilNextLife));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [lives, user]);

  if (!lives) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 rounded-full backdrop-blur-sm"
    >
      <div className="flex items-center gap-1">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: lives.maxLives }).map((_, index) => {
            const isFilled = index < lives.currentLives;
            return (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isFilled
                      ? 'fill-red-500 text-red-500 drop-shadow-glow'
                      : 'fill-gray-600 text-gray-600'
                  }`}
                  style={{
                    filter: isFilled ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none',
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {lives.currentLives < lives.maxLives && timeRemaining && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs font-medium text-red-400 whitespace-nowrap"
        >
          +1 em {timeRemaining}
        </motion.div>
      )}

      {lives.currentLives === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-medium text-red-400 whitespace-nowrap"
        >
          Sem vidas!
        </motion.div>
      )}
    </motion.div>
  );
}
