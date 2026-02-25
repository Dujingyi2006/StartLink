export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neumorphic: {
          light: '#FAF8F5',      // 温暖米白色
          dark: '#B4AFA5',       // 温暖灰褐色
          bg: '#F2EFE9',         // 燕麦色背景
          card: '#E3E5DB',       // 浅豆沙绿卡片
          text: '#2A2C2B',       // 深炭黑文本
          accent: '#5A6B4F',     // 深邃复古绿
          border: '#2A2C2B'      // 边框色
        }
      },
      boxShadow: {
        'neu-sm': '4px 4px 8px rgba(180, 175, 165, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-md': '8px 8px 16px rgba(180, 175, 165, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.7)',
        'neu-lg': '12px 12px 24px rgba(180, 175, 165, 0.4), -12px -12px 24px rgba(255, 255, 255, 0.7)',
        'neu-inset': 'inset 4px 4px 8px rgba(180, 175, 165, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neu-hover': '6px 6px 12px rgba(180, 175, 165, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.7)'
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Georgia', 'Noto Serif SC', 'serif'],
      }
    }
  },
  plugins: []
}
