/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: { 
        primary: { 
          light: '#67e8f9',
          DEFAULT: '#06b6d4', 
          dark: '#6a7547',
          'admin-sidebar-bg':'#1E204D',
          'admin-sidebar-text':'#E0E0FF',
          'admin-sidebar-active-bg': '#6A6FF8',
          'admin-sidebar-active-text': '#FFFFFF',
          'admin-content-bg': '#F7F8FC',
          'admin-card-bg': '#FFFFFF',
          'primary': '#6A6FF8',
        },
        borderRadius:{
          'xl':'1rem',
          '2xl':'1.5rem',
          '3xl':'2rem'
        },
        boxShadow:{
          'main':'0px 10px 30px rgba(22, 8,49,0.05)',
          'card': '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
        accent: '#facc15',
        neutral: {
          50: '#f8fafc', 
          100: '#f1f5f9', 
          800: '#1e293b',
          900: '#0f172a', 
        },
        plugins: [
          require('tailwind-scrollbar-hide')
        ]
      },
    },
  },
  plugins: [],
};
