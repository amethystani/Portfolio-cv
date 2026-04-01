import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"SF Mono"', 'Monaco', 'Menlo', 'Consolas', '"Courier New"', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#1E1E1E',
          titlebar: '#3C3C3C',
          text: '#F5F5F5',
          green: '#1DC121',
          blue: '#0A2FC4',
          red: '#C51E14',
          yellow: '#C7C329',
          cyan: '#20C5C6',
          dim: '#686868',
        },
        macos: {
          close: '#FF5F57',
          minimize: '#FEBC2E',
          maximize: '#28C840',
          desktop: '#2C2C2C',
        },
      },
    },
  },
  plugins: [],
}

export default config
