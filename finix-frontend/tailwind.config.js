/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transformStyle: {
        '3d': 'preserve-3d',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'finix-dark': '#121212',
        'finix-gray': '#1E1E1E',
        'finix-orange': '#FF6B00',
      },
      
      // --- ANIMACIONES ---
      animation: {
        shine: "shine 1s",
        shake: "shake 0.4s ease-in-out", // <--- NUEVO: Para errores de contraseña
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
        shake: { // <--- NUEVO: Efecto de temblor
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      // -------------------
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.transform-3d': {
          'transform-style': 'preserve-3d',
        },
      })
    },
  ],
}