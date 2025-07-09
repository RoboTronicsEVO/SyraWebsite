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
        // SyraRobot Academy Brand Colors
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7', 
          500: '#007A3D', // Primary Green (4.7:1 contrast)
          600: '#127745', // Dark Green (7.0:1 contrast)
          700: '#15803d',
          900: '#14532d',
        },
        accent: {
          500: '#CE1126', // Accent Red (4.3:1 contrast - use ≥18px)
          600: '#b91c1c',
        },
        neutral: {
          50: '#FFFFFF',   // Snow White
          100: '#DAE0DF',  // Soft Grey
          900: '#070A0D',  // Jet Black
        },
        // Extended palette for UI states
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        'heading': ['Electrolize', 'monospace'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'base': ['16px', '1.5'], // Minimum 16px for accessibility
        'lg': ['18px', '1.6'],
        'xl': ['20px', '1.7'],
        '2xl': ['24px', '1.4'],
        '3xl': ['30px', '1.3'],
        '4xl': ['36px', '1.2'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem',  // 352px
      },
      minWidth: {
        'touch': '44px', // Minimum touch target
      },
      minHeight: {
        'touch': '44px', // Minimum touch target
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'focus': '0 0 0 3px rgba(0, 122, 61, 0.2)', // 3px focus indicator
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
export default config
