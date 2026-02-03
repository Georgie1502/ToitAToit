/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1b2030',
        sky: '#dbe9f4',
        paper: '#ffffff',
        sun: '#feeb8d',
        rose: '#ef6d96',
        blue: '#60bbea',
        coral: '#ff586a',
        teal: '#8bd1d3',
        violet: '#826cad',
        deep: '#4a3279',
      },
      fontFamily: {
        display: ['"Fredoka"', 'system-ui', 'sans-serif'],
        body: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(27, 32, 48, 0.12)',
        lift: '0 22px 60px rgba(27, 32, 48, 0.18)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(219, 233, 244, 0.9) 0%, rgba(255, 255, 255, 0.95) 45%, rgba(254, 235, 141, 0.45) 100%)',
      },
    },
  },
  plugins: [],
};
