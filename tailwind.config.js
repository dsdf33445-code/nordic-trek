/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        nordic: {
          bg: '#F5F7FA',       // 雪白背景
          card: '#FFFFFF',     // 卡片白
          primary: '#3B82F6',  // 冰藍色 (主要行動)
          accent: '#0EA5E9',   // 輔助藍
          text: '#1E293B',     // 深岩灰 (主要文字)
          muted: '#64748B',    // 霧灰 (次要文字)
          success: '#10B981',  // 極光綠 (完成/確認)
          warning: '#F59E0B',  // 警示/待辦
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // 特製軟陰影
        'float': '0 10px 30px -5px rgba(59, 130, 246, 0.2)', // 懸浮陰影
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}