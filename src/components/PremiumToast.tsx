import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Zap, Trophy, Target, Flame } from 'lucide-react';
import { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'xp' | 'achievement' | 'goal' | 'streak';

interface PremiumToastProps {
  isVisible: boolean;
  message: string;
  type?: ToastType;
  icon?: ReactNode;
  duration?: number;
  onClose: () => void;
}

const typeConfig: Record<ToastType, { icon: ReactNode; bgColor: string; glowColor: string }> = {
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-green-500/20',
    glowColor: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgColor: 'bg-red-500/20',
    glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  },
  warning: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: 'bg-yellow-500/20',
    glowColor: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  },
  xp: {
    icon: <Zap className="w-5 h-5" />,
    bgColor: 'bg-primary/20',
    glowColor: 'shadow-[0_0_20px_rgba(0,174,239,0.4)]',
  },
  achievement: {
    icon: <Trophy className="w-5 h-5" />,
    bgColor: 'bg-accent/20',
    glowColor: 'shadow-[0_0_20px_rgba(20,241,255,0.4)]',
  },
  goal: {
    icon: <Target className="w-5 h-5" />,
    bgColor: 'bg-primary/20',
    glowColor: 'shadow-[0_0_20px_rgba(0,174,239,0.4)]',
  },
  streak: {
    icon: <Flame className="w-5 h-5" />,
    bgColor: 'bg-gradient-to-r from-orange-500/20 to-red-500/20',
    glowColor: 'shadow-[0_0_20px_rgba(251,146,60,0.4)]',
  },
};

export function PremiumToast({
  isVisible,
  message,
  type = 'success',
  icon,
  duration = 1300,
  onClose,
}: PremiumToastProps) {
  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100]"
          onAnimationComplete={() => {
            setTimeout(onClose, duration);
          }}
        >
          <div
            className={`
              ${config.bgColor}
              ${config.glowColor}
              backdrop-blur-xl
              border border-white/10
              rounded-2xl
              px-6 py-4
              flex items-center gap-3
              min-w-[280px]
              max-w-[400px]
            `}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="flex-shrink-0"
            >
              {icon || config.icon}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="text-soft-white font-semibold text-sm"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
