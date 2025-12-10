interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Logo({ variant = 'full', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  if (variant === 'icon') {
    return (
      <div className={`relative ${iconSizeClasses[size]} ${className}`}>
        <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full" />
        <svg
          className="relative w-full h-full text-neon-cyan"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 70 Q20 60 20 45 Q20 30 30 20 L35 25 Q27 33 27 45 Q27 57 35 65 L30 70Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M35 50 L45 40 L45 25"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="45" cy="20" r="4" fill="currentColor" />
          <path
            d="M35 50 L50 30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="53" cy="25" r="4" fill="currentColor" />
          <path
            d="M35 50 L55 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="60" cy="43" r="4" fill="currentColor" />
          <path
            d="M35 50 L50 55"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="53" cy="58" r="4" fill="currentColor" />
          <path
            d="M70 25 L75 30 Q80 40 75 50 L70 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`font-bold text-soft-white ${className}`}>
        Mentes<span className="text-neon-cyan">.ia</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${iconSizeClasses[size]}`}>
        <div className="absolute inset-0 bg-neon-cyan/20 blur-md rounded-full" />
        <svg
          className="relative w-full h-full text-neon-cyan"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 70 Q20 60 20 45 Q20 30 30 20 L35 25 Q27 33 27 45 Q27 57 35 65 L30 70Z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M35 50 L45 40 L45 25"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="45" cy="20" r="4" fill="currentColor" />
          <path
            d="M35 50 L50 30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="53" cy="25" r="4" fill="currentColor" />
          <path
            d="M35 50 L55 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="60" cy="43" r="4" fill="currentColor" />
          <path
            d="M35 50 L50 55"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="53" cy="58" r="4" fill="currentColor" />
          <path
            d="M70 25 L75 30 Q80 40 75 50 L70 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
      <div>
        <h1
          className={`font-bold text-soft-white leading-tight ${
            size === 'sm' ? 'text-base' : size === 'md' ? 'text-xl' : size === 'lg' ? 'text-2xl' : 'text-4xl'
          }`}
        >
          Mentes<span className="text-neon-cyan">.ia</span>
        </h1>
        {size !== 'sm' && <p className="text-xs text-soft-muted">Powered by AI</p>}
      </div>
    </div>
  );
}
