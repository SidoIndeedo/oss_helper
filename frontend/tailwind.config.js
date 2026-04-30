/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00f3ff',
        'neon-magenta': '#ff00e5',
        'neon-green': '#33ff99',
        'dark-bg': '#0a0a0f',
        'card-bg': '#111118',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow 1.5s ease-in-out infinite alternate',
        'scanline': 'scan 8s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 2px #00f3ff, 0 0 5px #00f3ff' },
          '100%': { textShadow: '0 0 8px #00f3ff, 0 0 15px #ff00e5' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
    },
  },
  plugins: [],
}