/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0a0a0a",
        "bg-secondary": "#111111",
        "accent-red": "#CC0000",
        "accent-red-bright": "#FF0000",
        gray: "#333333",
        "text-muted": "#888888",
      },
      fontFamily: {
        sans: ["Cairo", "Tajawal", "Rajdhani", "system-ui", "sans-serif"],
        arabic: ["Cairo", "Tajawal", "Rajdhani", "system-ui", "sans-serif"],
        display: ["Cairo", "Tajawal", "Rajdhani", "system-ui", "sans-serif"],
        latin: ["Cairo", "Tajawal", "Rajdhani", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 28px rgba(255,0,0,0.45), inset 0 0 16px rgba(255,0,0,0.2)",
      },
      backgroundImage: {
        "radial-red": "radial-gradient(circle, rgba(204,0,0,0.28) 0%, rgba(10,10,10,0) 60%)",
      },
    },
  },
  plugins: [],
};
