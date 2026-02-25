export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        neumorphic: {
          light: '#e0e5ec',
          dark: '#a3b1c6',
          bg: '#e0e5ec'
        }
      },
      boxShadow: {
        'neu-sm': '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
        'neu-md': '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
        'neu-lg': '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff',
        'neu-inset': 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
        'neu-hover': '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff'
      }
    }
  },
  plugins: []
}
