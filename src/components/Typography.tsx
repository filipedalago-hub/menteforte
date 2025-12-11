import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}

export function TitleXL({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.h1 : 'h1';
  return (
    <Component
      className={`
        text-4xl sm:text-5xl md:text-6xl lg:text-7xl
        font-bold
        text-soft-white
        leading-tight
        tracking-tight
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      })}
    >
      {children}
    </Component>
  );
}

export function TitleLG({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.h2 : 'h2';
  return (
    <Component
      className={`
        text-3xl sm:text-4xl md:text-5xl
        font-bold
        text-soft-white
        leading-tight
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
      })}
    >
      {children}
    </Component>
  );
}

export function TitleMD({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.h3 : 'h3';
  return (
    <Component
      className={`
        text-xl sm:text-2xl md:text-3xl
        font-semibold
        text-soft-white
        leading-snug
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
      })}
    >
      {children}
    </Component>
  );
}

export function Body({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.p : 'p';
  return (
    <Component
      className={`
        text-base md:text-lg
        text-soft-white
        leading-relaxed
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, delay: 0.1 },
      })}
    >
      {children}
    </Component>
  );
}

export function BodySoft({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.p : 'p';
  return (
    <Component
      className={`
        text-sm md:text-base
        text-soft-gray
        leading-relaxed
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, delay: 0.15 },
      })}
    >
      {children}
    </Component>
  );
}

export function Caption({ children, className = '', animated = false }: TypographyProps) {
  const Component = animated ? motion.span : 'span';
  return (
    <Component
      className={`
        text-xs md:text-sm
        text-soft-muted
        leading-normal
        ${className}
      `}
      {...(animated && {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2, delay: 0.2 },
      })}
    >
      {children}
    </Component>
  );
}
