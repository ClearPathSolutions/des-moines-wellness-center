import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2D5A3D',
          dark: '#1E3E2A',
          light: '#7D9B76',
          50: '#F1F5F0',
          100: '#DCE6D8',
          600: '#2D5A3D',
          700: '#244A32',
          900: '#16301F',
        },
        sage: '#7D9B76',
        gold: {
          // DEFAULT is the brand gold, but at 3.75:1 against white it is not an
          // AA text or button colour at body size — it is for icons, washes and
          // large display type only. `dark` (5.66:1 on white) carries text and
          // button fills; `deep` is its hover step (7.63:1).
          DEFAULT: '#A77C43',
          light: '#C39A62',
          dark: '#875F2F',
          deep: '#6E4D26',
        },
        ink: '#222222',
        cream: '#FAF8F3',
        surface: '#FFFFFF',
        muted: '#5A6560',
        line: '#E4E2DA',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(30, 62, 42, 0.15)',
        card: '0 2px 12px -4px rgba(30, 62, 42, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}

export default config
