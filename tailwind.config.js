/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita o modo escuro via classe .dark
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EA1D2C", // iFood Red mantido como destaque
        secondary: {
          light: "#3E3E3E",
          dark: "#F3F4F6",
        },
        background: {
          light: "#FDFDFD",
          dark: "#0F0F0F",
        },
        card: {
          light: "#FFFFFF",
          dark: "#1A1A1A",
        },
        accent: "#F7C325",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'premium-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
