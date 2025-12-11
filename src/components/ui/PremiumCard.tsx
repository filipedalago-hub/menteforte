import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type CardVariant = 'glass' | 'elevated' | 'flat' | 'glow';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface PremiumCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  glowColor?: string;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  glass: `
    bg-white/[0.06]
    backdrop-blur-xl
    border border-white/10
    shadow-[0_8px_32px_rgba(0,0,0,0.3)]
  `,
  elevated: `
    bg-dark-lighter
    border border-titanium/20
    shadow-[0_20px_60px_rgba(0,0,0,0.4)]
  `,
  flat: `
    bg-dark-lighter/50
    border border-titanium/10
  `,
  glow: `
    bg-dark-lighter
    border border-accent/20
    shadow-[0_0_30px_rgba(20,241,255,0.15)]
  `,
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
  xl: 'p-8 md:p-10',
};

export function PremiumCard({
  children,
  variant = 'glass',
  padding = 'md',
  interactive = true,
  glowColor = '#14F1FF',
  className = '',
  ...props
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={
        interactive
          ? {
              scale: 1.02,
              boxShadow: `0 0 40px ${glowColor}30`,
              transition: { duration: 0.2 },
            }
          : undefined
      }
      whileTap={interactive ? { scale: 0.98 } : undefined}
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${interactive ? 'cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
