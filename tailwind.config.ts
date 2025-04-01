import type { Config } from 'tailwindcss'
const defaultTheme = require("tailwindcss/defaultTheme");
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
        border: "hsl(var(--border))",
      },
      fontFamily: {
        // You can add custom fonts here
      },
      screens: {
        ...defaultTheme.screens,
        
        '13i': '1280px',
        '15i': '1440px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
    },
  },
  plugins: [],
}

export default config
