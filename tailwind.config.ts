import type { Config } from 'tailwindcss'

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
        // You can customize breakpoints here
      },
    },
  },
  plugins: [],
}

export default config
