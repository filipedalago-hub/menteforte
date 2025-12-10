/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00AEEF',
        background: '#0A0F2D',
        accent: '#14F1FF',
        neon: '#0066FF',
        'white-soft': '#E6F1FF',
        neutral: '#2F3A4D',
        dark: '#0A0F2D',
        'dark-lighter': '#111936',
        titanium: '#2F3A4D',
        'soft-white': '#E6F1FF',
        'soft-gray': '#A9B9D6',
        'soft-muted': '#6B7A9F',
        'neon-cyan': '#14F1FF',
        'neon-blue': '#0066FF',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00AEEF 0%, #0066FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #14F1FF 0%, #00AEEF 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0F2D 0%, #111936 100%)',
        'gradient-neon': 'linear-gradient(135deg, #0066FF 0%, #14F1FF 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(20, 241, 255, 0.3)',
        'glow-md': '0 0 20px rgba(20, 241, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(20, 241, 255, 0.5)',
        'glow-primary': '0 0 20px rgba(0, 174, 239, 0.4)',
        'glow-accent': '0 0 20px rgba(20, 241, 255, 0.5)',
        'glow-neon': '0 0 25px rgba(0, 102, 255, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(20, 241, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(20, 241, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
