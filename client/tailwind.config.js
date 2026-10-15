/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#070709',
        obsidian: '#0B0B0E',
        surface: '#121217',
        surfaceLight: '#181820',
        bone: '#14141B',
        alabaster: '#F6F4EF',
        ink: '#F5F3EF',
        body: '#A3A3B0',
        muted: '#71717A',
        gold: {
          light: '#F3E5C8',
          DEFAULT: '#D4AF37',
          deep: '#C5A880',
          dark: '#A98B5D',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 20px 50px rgba(0,0,0,0.5)',
        lift: '0 30px 70px rgba(0,0,0,0.7)',
        glowGold: '0 0 30px rgba(212, 175, 55, 0.22)',
      },
      keyframes: {
        spinSlow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: { spinSlow: 'spinSlow 28s linear infinite' },
    },
  },
  plugins: [],
};
