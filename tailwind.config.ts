import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        'custom-bg': '#EBF0F8',

        gray: {
          100: '#FCFCFC',
          200: '#F9F9F9',
          300: '#DFE1E0',
          400: '#C1C3C2',
          500: '#6A6F6D',
          600: '#4F5653',
          700: '#363D3A',
        },
        black: '#000201',
        brand: {
          100: '#F3FAED',
          200: '#E7F4DC',
          300: '#CFE9B9',
          400: '#A0D16E',
          500: '#89C53F',
          600: '#76AB35',
        },
        blue: {
          100: 'rgb(0,150, 199, 10%)',
          200:'#0096C7',
          300:'#0077B6'
        },
        red: {
          100: '#FEEEEE',
          200: '#FE8F83',
          300: '#ED2B2A',
        },
        green: '#89C53F',
        secondary:'#6B4DE6'
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-2%' }],
        'display-sm': ['2rem', { lineHeight: '2.5rem', letterSpacing: '-2%' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-2%' }],
        'headline-lg': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-1%' }],
        'headline-md': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-1%' }],
        'headline-sm': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-1%' }],
        'body-lg': ['1.25rem', { lineHeight: '1.875rem' }],
        'body-md': ['1rem', { lineHeight: '1.5rem' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'body-xs': ['0.75rem', { lineHeight: '1.125rem' }],
      }
    }
  },
  plugins: [],
} satisfies Config;
