import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#8b5cf6',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: 'rgba(17, 24, 39, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
  plugins: [],
};
export default config;
