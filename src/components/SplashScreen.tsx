import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-dark flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0px rgba(20, 241, 255, 0)',
              '0 0 60px rgba(20, 241, 255, 0.4)',
              '0 0 0px rgba(20, 241, 255, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full"
        >
          <Logo size="xl" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-soft-white font-semibold text-lg">
            Transforme sua mente
          </p>
          <p className="text-accent text-sm mt-1">
            Carregando experiência...
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
}
