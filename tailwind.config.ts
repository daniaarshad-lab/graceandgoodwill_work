import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-family-poppins)', 'sans-serif'],
      },
      fontSize: {
        'h1': ['var(--size-h1)', { lineHeight: 'var(--lh-h1)', fontWeight: 'var(--weight-bold)' }],
        'h2': ['var(--size-h2)', { lineHeight: 'var(--lh-h2)', fontWeight: 'var(--weight-bold)' }],
        'h3': ['var(--size-h3)', { lineHeight: 'var(--lh-h3)', fontWeight: 'var(--weight-bold)' }],
        'h4': ['var(--size-h4)', { lineHeight: 'var(--lh-h4)', fontWeight: 'var(--weight-bold)' }],
        'body-base': ['var(--size-body-base)', { lineHeight: 'var(--lh-body-base)' }],
        'body-small': ['var(--size-body-small)', { lineHeight: 'var(--lh-body-small)' }],
        'caption': ['var(--size-caption)', { lineHeight: 'var(--lh-caption)' }],
        'button-default': ['var(--size-button-default)', { lineHeight: 'var(--lh-button-default)', fontWeight: 'var(--weight-semibold)' }],
        'button-small': ['var(--size-button-small)', { lineHeight: 'var(--lh-button-small)', fontWeight: 'var(--weight-semibold)' }],
        'form-label': ['var(--size-form-label)', { lineHeight: 'var(--lh-form-label)', fontWeight: 'var(--weight-medium)' }],
        'form-input': ['var(--size-form-input)', { lineHeight: 'var(--lh-form-input)' }],
        'form-help': ['var(--size-form-help)', { lineHeight: 'var(--lh-form-help)' }],
      },
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
          muted: '#A08054',
          darker: 'var(--color-gold-darker)',
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
