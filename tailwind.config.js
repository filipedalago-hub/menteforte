/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4A90E2',
          dark: '#1F2D3D',
        },
        secondary: {
          purple: '#A890FF',
          mint: '#C6F6D5',
        },
        neutral: {
          mist: '#F5F7FA',
          deep: '#3E4C59',
          medium: '#9AA5B1',
        },
        accent: {
          orange: '#FFB367',
          gold: '#F6C36A',
        },
      },
    },
  },
  plugins: [],
};
