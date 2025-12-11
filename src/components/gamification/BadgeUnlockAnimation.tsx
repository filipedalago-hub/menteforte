import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { useEffect } from 'react';
import { haptics } from '../../lib/haptics';
import { getRarityColor, type BadgeRarity } from '../../utils/gamificationSystem';

interface BadgeUnlockAnimationProps {
  isVisible: boolean;
  badgeName: string;
  badgeDescription: string;
  rarity: BadgeRarity;
  onComplete: () => void;
}

export function BadgeUnlockAnimation({
  isVisible,
  badgeName,
  badgeDescription,
  rarity,
  onComplete,
}: BadgeUnlockAnimationProps) {
  const rarityColor = getRarityColor(rarity);

  useEffect(() => {
    if (isVisible) {
      haptics.success();
      const timer = setTimeout(onComplete, 3500);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0, rotateY: -180 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0, rotateY: 180 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative max-w-md mx-4"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl blur-2xl"
              style={{ backgroundColor: `${rarityColor}40` }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-dark-lighter border-2 rounded-3xl p-10 text-center"
              style={{ borderColor: rarityColor }}
            >
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm font-semibold mb-4"
                style={{ color: rarityColor }}
              >
                NOVA CONQUISTA DESBLOQUEADA
              </motion.p>

              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
                style={{
                  backgroundColor: `${rarityColor}20`,
                  border: `3px solid ${rarityColor}`,
                  boxShadow: `0 0 40px ${rarityColor}60`
                }}
              >
                <Award className="w-12 h-12" style={{ color: rarityColor }} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-soft-white mb-3"
              >
                {badgeName}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-soft-gray leading-relaxed mb-6"
              >
                {badgeDescription}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: `${rarityColor}20`,
                  color: rarityColor,
                }}
              >
                {rarity.toUpperCase()}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-soft-muted mt-6"
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
