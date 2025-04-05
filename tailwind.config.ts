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
        primary: "#19486A",
      },
      screens: {
        ...defaultTheme.screens,
        
        '13i': '1280px',
        '15i': '1440px',
        '3xl': '1920px',
        '4xl': '2560px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'slide-in-right': {
          '0%': { 
            transform: 'translateX(100%)' 
          },
          '100%': { 
            transform: 'translateX(0)' 
          }
        },
        'slide-out-right': {
          '0%': { 
            transform: 'translateX(0)' 
          },
          '100%': { 
            transform: 'translateX(100%)' 
          }
        },
        'slide-in-left': {
          '0%': { 
            transform: 'translateX(-100%)' 
          },
          '100%': { 
            transform: 'translateX(0)' 
          }
        },
        'slide-out-left': {
          '0%': { 
            transform: 'translateX(0)' 
          },
          '100%': { 
            transform: 'translateX(-100%)' 
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'slide-out-left': 'slide-out-left 0.3s ease-out',
        'slide-up': 'slide-up 0.5s ease-out'
      }
    },
  },
  plugins: [],
}

export default config
