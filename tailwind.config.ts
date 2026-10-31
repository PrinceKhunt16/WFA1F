import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18232f",
        muted: "#6e7c89",
        cloud: "#f5f7f8",
        line: "#e3e8eb",
        pine: "#197c61",
        coral: "#c85b59",
        amber: "#b67a23",
      },
      boxShadow: {
        panel: "0 12px 32px rgba(24, 35, 47, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
