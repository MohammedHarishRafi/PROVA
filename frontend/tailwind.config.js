/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Enterprise brand palette (used by App shell/sidebar)
        brand: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF6A00',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Dark palette (used by App shell in dark mode)
        dark: {
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Dashboard-specific tokens
        dbg:        '#FAF6F2',
        dcard:      '#FFFFFF',
        dprimary:   '#FF6A00',
        dsecondary: '#FFB347',
        dsuccess:   '#22C55E',
        dwarning:   '#F59E0B',
        ddanger:    '#EF4444',
        dtextpri:   '#111111',
        dtextsec:   '#666666',
        dborder:    '#F0E6DD',
      },
      borderRadius: {
        'dashboard': '20px',
      },
      boxShadow: {
        'dashboard': '0 10px 30px rgba(0,0,0,0.05)',
        'card-hover': '0 20px 40px rgba(0,0,0,0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideUp': 'slideUp 0.4s ease-out',
        'rocketFly': 'rocketFly 3s ease-in-out infinite',
        'rocketFlame': 'rocketFlame 0.3s ease-in-out infinite alternate',
        'rocketBounce': 'rocketBounce 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        rocketFly: {
          '0%': { transform: 'translateX(-10px) rotate(-5deg)' },
          '50%': { transform: 'translateX(5px) rotate(5deg)' },
          '100%': { transform: 'translateX(-10px) rotate(-5deg)' },
        },
        rocketFlame: {
          '0%': { opacity: '0.6', transform: 'scaleX(0.8)' },
          '100%': { opacity: '1', transform: 'scaleX(1.2)' },
        },
        rocketBounce: {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(2px)' },
        },
      },
    },
  },
  plugins: [],
};
