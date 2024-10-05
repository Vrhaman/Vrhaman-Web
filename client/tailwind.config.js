/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          base: "var(--color-text-base)",
          muted: "var(--color-text-muted)",
        },
        fill: "var(--color-fill)",
        input: {
          text: "var(--color-input-text)",
          fill: "var(--color-input-fill)",
        },
        "fill-muted": "var(--color-fill-muted)",
        "button-accent": "var(--color-button-accent)",
        "button-accent-hover": "var(--color-button-accent-hover)",
        "button-muted": "var(--color-button-muted)",
        background: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
        },
        border: "var(--border-color)",
        shadow: "var(--shadow)",
        link: "var(--link-color)",
      },
    },
  },
  plugins: [],
};
