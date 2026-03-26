/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ngc-navy':       '#0B1E3E',
        'ngc-navy-mid':   '#122952',
        'ngc-blue':       '#1A56A5',
        'ngc-sky':        '#2E87D4',
        'ngc-gold':       '#C8922A',
        'ngc-gold-light': '#F0B849',
        'ngc-off-white':  '#F5F3EE',
        'ngc-muted':      '#5A6070',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'slide-down': 'slideDown 0.3s ease forwards',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        ticker:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}

