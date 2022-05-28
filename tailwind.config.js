/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        "currency-picker": "1em auto 1em",
      },
    },
  },
  plugins: [],
};
