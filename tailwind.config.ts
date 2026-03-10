import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" },
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px" },
    },
    extend: {
      minHeight: {
        "touch": "44px",
        "screen-dyn": "100dvh",
      },
      screens: {
        "xs": "375px",
      },
      colors: {
        phoenix: {
          dark: "#0D0D0D",
          surface: "#1A1A1A",
          card: "#242424",
          border: "#2E2E2E",
          muted: "#6B6B6B",
          "text-muted": "#A0A0A0",
          text: "#F8F8F8",
          primary: "#E85D04",
          "primary-hover": "#F4A261",
          accent: "#DC2F02",
          gold: "#E9C46A",
          success: "#2D6A4F",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-mono)", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backgroundImage: {
        "gradient-phoenix":
          "linear-gradient(135deg, #E85D04 0%, #DC2F02 50%, #E9C46A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
