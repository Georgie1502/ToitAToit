/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.25rem',
        lg: '1.5rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        primaryHover: 'var(--color-primary-hover)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        accentSoft: 'var(--color-accent-soft)',
        support: 'var(--color-support)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        card: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        inverse: 'var(--color-inverse)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        backdrop: 'var(--color-backdrop)',
        danger: 'var(--color-danger)',
        success: '#16A34A',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(0, 0, 0, 0.05)',
        lift: '0 12px 32px rgba(0, 0, 0, 0.08)',
        focus: '0 0 0 4px rgba(249, 115, 22, 0.22)',
      },
      borderRadius: {
        lg: '12px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '32px',
      },
      transitionTimingFunction: {
        subtle: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, rgba(249, 250, 251, 0.9) 0%, rgba(229, 231, 235, 0.85) 45%, rgba(107, 142, 122, 0.15) 100%)',
      },
    },
  },
  plugins: [],
};
