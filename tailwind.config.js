/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Noms uniformes pour correspondre à index.css
        'djougou-primary': '#C0392B',
        'djougou-secondary': '#F39C12',
        'djougou-success': '#1E8449',
        'djougou-sand': '#FDEBD0',
        'djougou-card': '#FFFFFF',
        'djougou-dark': '#1A1A2E',
        'djougou-muted': '#6B7280',
        'djougou-border': '#E5E7EB',
        // Alias pour compatibilité
        'primary': '#C0392B',
        'secondary': '#F39C12',
        'success': '#1E8449',
        'background': '#FDEBD0',
        'card': '#FFFFFF',
        'dark': '#1A1A2E',
        'muted': '#6B7280',
        'border': '#E5E7EB',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}