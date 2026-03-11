/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1313ec",
        "background-light": "#f6f6f8",
        "background-dark": "#101022",
        ink: "#0f172a",
        mist: "#94a3b8"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 45px -25px rgba(19, 19, 236, 0.35)"
      }
    }
  },
  plugins: []
};
