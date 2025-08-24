/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#5B5FF7',
        secondary: '#00C2A8',
        accent: '#FF6B6B',
        'dark-bg': '#0E0E1A',
        'card-bg': '#1A1B2E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#A0A0B2',
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};