/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FDF8F2',
        surface: '#F7EFE4',
        'surface-card': '#F7EFE4',
        'text-primary': '#2B1D12',
        'text-muted': '#6B5A4A',
        border: '#E8DCC8',
        accent: {
          DEFAULT: '#BC4800',
          hover: '#9A3A00',
          light: 'rgba(188, 72, 0, 0.10)',
        },
        'accent-gold': '#E3A857',
        status: {
          success: '#4E7A51',
          'success-bg': 'rgba(78, 122, 81, 0.15)',
          warning: '#C48A2E',
          'warning-bg': 'rgba(196, 138, 46, 0.15)',
          danger: '#A6402F',
          'danger-bg': 'rgba(166, 64, 47, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

