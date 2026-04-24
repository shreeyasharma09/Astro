/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        bg: { light: '#FBF8FF', dark: '#1A1826' },
        surface: { light: '#FFFFFF', dark: '#252236' },
        lilac: { DEFAULT: '#B5A5E8', strong: '#8E78D0', soft: '#E8E0FB', dark: '#C9BAF5' },
        sage: { DEFAULT: '#A8C9A8', strong: '#7FAE7F', soft: '#DFEDDF', dark: '#B8D9B8' },
        sky: { DEFAULT: '#A5C9E8', strong: '#6FA5D1', soft: '#DEEDFB', dark: '#B5D9F5' },
        coral: '#F2B5B5',
        crisis: '#E8655C',
        ink: { light: '#2D2A3E', dark: '#F0EEF8' },
        mute: { light: '#6B6880', dark: '#9C9AAD' },
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        modal: '20px',
      },
      boxShadow: {
        soft: '0 4px 16px rgba(45,42,62,0.08)',
        'soft-dark': '0 4px 16px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};