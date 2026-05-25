import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a1128',
          900: '#0f1a33',
          800: '#1a2d4d',
          700: '#253d66',
          600: '#304d7f',
        },
        gold: {
          50: '#fef9f3',
          100: '#fde6c4',
          200: '#f5d4a0',
          300: '#e8ba7a',
          400: '#d4a047',
          500: '#c99232',
          600: '#b8812a',
          DEFAULT: '#d4af37',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.12)',
        elegant: '0 10px 40px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
