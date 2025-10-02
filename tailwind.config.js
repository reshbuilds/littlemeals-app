/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // LittleMeals Scandinavian-minimal color palette
        primary: {
          DEFAULT: 'hsl(140, 25%, 45%)', // Primary sage green
          foreground: 'hsl(35, 25%, 98%)', // Primary green foreground (cream white)
          light: 'hsl(140, 20%, 90%)', // Very light sage accent
          dark: 'hsl(140, 30%, 35%)', // Darker sage for pressed states
        },
        background: {
          DEFAULT: 'hsl(35, 20%, 98%)', // Main background - warm cream
          card: 'hsl(35, 25%, 96%)', // Card background - soft cream
          secondary: 'hsl(35, 30%, 92%)', // Secondary background - light cream
          muted: 'hsl(35, 15%, 88%)', // Muted background for disabled states
        },
        foreground: {
          DEFAULT: 'hsl(160, 8%, 15%)', // Primary text - deep blue-gray
          muted: 'hsl(160, 6%, 50%)', // Secondary text - softer gray
          light: 'hsl(160, 4%, 70%)', // Tertiary text - light gray
          inverse: 'hsl(35, 25%, 98%)', // Text on dark backgrounds
        },
        border: {
          DEFAULT: 'hsl(35, 15%, 88%)', // Default border
          light: 'hsl(35, 10%, 92%)', // Light border
          strong: 'hsl(35, 20%, 80%)', // Strong border
        },
        success: {
          DEFAULT: 'hsl(120, 40%, 50%)', // Success green
          light: 'hsl(120, 40%, 90%)', // Light success background
          foreground: 'hsl(120, 100%, 25%)', // Success text
        },
        warning: {
          DEFAULT: 'hsl(45, 90%, 60%)', // Warning yellow
          light: 'hsl(45, 90%, 95%)', // Light warning background
          foreground: 'hsl(45, 100%, 25%)', // Warning text
        },
        error: {
          DEFAULT: 'hsl(0, 65%, 55%)', // Error red
          light: 'hsl(0, 65%, 95%)', // Light error background
          foreground: 'hsl(0, 70%, 35%)', // Error text
        },
        responses: {
          eaten: {
            DEFAULT: 'hsl(120, 40%, 50%)', // Green for eaten
            light: 'hsl(120, 40%, 90%)',
            foreground: 'hsl(120, 100%, 25%)',
          },
          partial: {
            DEFAULT: 'hsl(45, 90%, 60%)', // Yellow for partially eaten
            light: 'hsl(45, 90%, 95%)',
            foreground: 'hsl(45, 100%, 25%)',
          },
          refused: {
            DEFAULT: 'hsl(0, 65%, 55%)', // Red for refused
            light: 'hsl(0, 65%, 95%)',
            foreground: 'hsl(0, 70%, 35%)',
          },
        },
      },
      borderRadius: {
        lg: '12px', // 0.75rem for gentle, approachable feel
      },
      fontFamily: {
        system: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Roboto', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem', // 72px
        '22': '5.5rem', // 88px
      }
    },
  },
  plugins: [],
}