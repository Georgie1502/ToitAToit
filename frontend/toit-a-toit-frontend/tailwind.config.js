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
        primaryContainer: 'rgb(var(--color-primary-container-rgb) / <alpha-value>)',
        secondary: 'var(--color-secondary)',
        secondaryContainer: 'var(--color-secondary-container)',
        accent: 'var(--color-accent)',
        accentSoft: 'rgb(var(--color-accent-soft-rgb) / <alpha-value>)',
        support: 'var(--color-support)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        surfaceContainer: 'var(--color-surface-container)',
        card: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        inverse: 'var(--color-inverse)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        backdrop: 'var(--color-backdrop)',
        danger: 'var(--color-danger)',
        success: '#2E7D32',
        warning: '#F59E0B',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'serif'],
      },
      boxShadow: {
        /* Ambient glow — tinted with on_surface, never black */
        soft: '0 2px 40px rgba(38, 48, 53, 0.05)',
        lift: '0 4px 48px rgba(38, 48, 53, 0.09)',
        focus: '0 0 0 4px rgba(168, 39, 90, 0.2)',
      },
      borderRadius: {
        lg: '12px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '48px',   /* 3rem — "xl" scale from design system */
      },
      backgroundImage: {
        /* Signature CTA gradient */
        'cta-gradient': 'linear-gradient(135deg, #A8275A 0%, #FF709F 100%)',
        'hero-gradient': 'linear-gradient(135deg, #EEF8FF 0%, #DDEAF2 100%)',
      },
      transitionTimingFunction: {
        subtle: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
