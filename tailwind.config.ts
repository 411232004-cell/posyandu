import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 30px rgba(244, 63, 94, 0.15)",
        button: "0 4px 0 0 #e11d48",
      },
      colors: {
        roseGlow: {
          50: "#FDF2F8",
          100: "#FCE7F3",
          500: "#F43F5E",
          900: "#881337",
        },
      },
      backgroundImage: {
        "pink-gradient": "linear-gradient(135deg, #fda4af 0%, #f472b6 35%, #fb7185 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
