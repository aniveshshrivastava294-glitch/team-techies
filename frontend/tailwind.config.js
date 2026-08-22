/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Slate & Stone Design System
        canvas: '#F5F4F0',
        surface: '#DCD7CC',
        'surface-card': '#DCD7CC',
        'text-primary': '#1F2A38',
        'text-muted': '#8A8578',
        border: '#E2DED4',
        accent: {
          DEFAULT: '#3E5C76',
          hover: '#2E4459',
          light: 'rgba(62, 92, 118, 0.10)',
        },
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
