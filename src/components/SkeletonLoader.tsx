import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function Skeleton({ width = '100%', height = '1rem', rounded = 'md', className = '' }: SkeletonProps) {
  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <motion.div
      className={`bg-titanium/20 ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-dark-lighter/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width="48px" height="48px" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="1.25rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
      </div>
      <Skeleton width="100%" height="4rem" />
      <div className="flex gap-2">
        <Skeleton width="30%" height="2rem" />
        <Skeleton width="30%" height="2rem" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
