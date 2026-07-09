/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0a0a0a",
          soft: "#121110",
          elevated: "#17140f",
          line: "#2a251c",
        },
        gold: {
          DEFAULT: "#c9a227",
          soft: "#d4a574",
          deep: "#8b5e34",
          bright: "#e8c766",
        },
        cream: {
          DEFAULT: "#f5efe6",
          muted: "#a89a8a",
          dim: "#736657",
        },
        rust: "#a8562f",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        arDisplay: ["Cairo", "sans-serif"],
        arBody: ["Tajawal", "sans-serif"],
      },
      backgroundImage: {
        "tea-gradient":
          "radial-gradient(60% 60% at 50% 30%, rgba(201,162,39,0.18) 0%, rgba(10,10,10,0) 70%)",
        "gold-line":
          "linear-gradient(90deg, transparent, #c9a227, transparent)",
      },
      boxShadow: {
        gold: "0 8px 30px -8px rgba(201,162,39,0.35)",
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

