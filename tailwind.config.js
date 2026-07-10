/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: "#0D1210",
        "base-soft": "#121814",
        "base-elevated": "#161F1A",
        "base-line": "#26332B",
        gold: {
          DEFAULT: "#C9A24B",
          soft: "#B7924A",
          bright: "#EFD9A0",
          deep: "#8b5e34",
        },
        cream: {
          DEFAULT: "#F4ECD8",
          muted: "#CFC5AC",
          dim: "#8C8571",
        },
        rust: "#A8452E",
        teal: {
          DEFAULT: "#1F5C55",
          soft: "#2E766D",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        arDisplay: ["Aref Ruqaa", "Cairo", "serif"],
        arBody: ["IBM Plex Sans Arabic", "Tajawal", "sans-serif"],
        stamp: ["Zilla Slab Highlight", "serif"],
      },
      backgroundImage: {
        "tea-gradient":
          "radial-gradient(60% 60% at 50% 30%, rgba(201,162,75,0.18) 0%, rgba(13,18,16,0) 70%)",
        "gold-line":
          "linear-gradient(90deg, transparent, #C9A24B, transparent)",
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(201,162,75,0.35)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
}
