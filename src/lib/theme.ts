export const theme = {
  colors: {
    primary: '#00AEEF',
    background: '#0A0F2D',
    accent: '#14F1FF',
    neon: '#0066FF',
    whiteSoft: '#E6F1FF',
    neutral: '#2F3A4D',

    dark: '#0A0F2D',
    darkLighter: '#111936',
    titanium: '#2F3A4D',
    softWhite: '#E6F1FF',
    softGray: '#A9B9D6',
    softMuted: '#6B7A9F',
    neonCyan: '#14F1FF',
    neonBlue: '#0066FF',
  },

  gradients: {
    primary: 'linear-gradient(135deg, #00AEEF 0%, #0066FF 100%)',
    accent: 'linear-gradient(135deg, #14F1FF 0%, #00AEEF 100%)',
    dark: 'linear-gradient(180deg, #0A0F2D 0%, #111936 100%)',
    neon: 'linear-gradient(135deg, #0066FF 0%, #14F1FF 100%)',
  },

  shadows: {
    glowSm: '0 0 10px rgba(20, 241, 255, 0.3)',
    glowMd: '0 0 20px rgba(20, 241, 255, 0.4)',
    glowLg: '0 0 30px rgba(20, 241, 255, 0.5)',
    glowPrimary: '0 0 20px rgba(0, 174, 239, 0.4)',
    glowAccent: '0 0 20px rgba(20, 241, 255, 0.5)',
    glowNeon: '0 0 25px rgba(0, 102, 255, 0.4)',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;

export const getThemeColor = (color: keyof typeof theme.colors) => theme.colors[color];
export const getThemeGradient = (gradient: keyof typeof theme.gradients) => theme.gradients[gradient];
export const getThemeShadow = (shadow: keyof typeof theme.shadows) => theme.shadows[shadow];
