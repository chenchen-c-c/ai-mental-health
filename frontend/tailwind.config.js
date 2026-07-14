/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        100: '25rem',
        128: '32rem',
        160: '40rem',
        200: '50rem',
      },
    },
  },
}
