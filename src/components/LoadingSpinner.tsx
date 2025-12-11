import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'white';
}

export function LoadingSpinner({ size = 'md', variant = 'accent' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'border-primary',
    accent: 'border-accent',
    white: 'border-white',
  };

  return (
    <motion.div
      className={`
        ${sizeClasses[size]}
        border-4
        ${colorClasses[variant]}
        border-t-transparent
        rounded-full
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        <LoadingSpinner size="lg" variant="accent" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-soft-white font-medium"
        >
          Carregando...
        </motion.p>
      </motion.div>
    </div>
  );
}
