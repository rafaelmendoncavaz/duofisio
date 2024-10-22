/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "index.html",
    "src/**/*.{tsx,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        fisioblue: "#163359",
        fisioblue2: "#053959",
        fisiogray: "#2E2D40",
        fisiolightgray: "#61748C"
      },
      boxShadow: {
        shape: "0px 8px 8px rgba(0, 0, 0, 0.1), 0px 4px 4px rgba(0, 0, 0, 0.1), 0px 2px 2px rgba(0, 0, 0, 0.1), 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.03), inset 0px 1px 0px rgba(255, 255, 255, 0.03)"
      },
      fontFamily: {
        "roboto": ["Roboto", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"]
      },
      scrollbarWidth: {
        none: 'none',
      },
      scrollbar: {
        hidden: 'hidden',
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.scrollbar-hidden': {
          'scrollbar-width': 'none',
        },
        '.scrollbar-none': {
          'overflow': 'hidden',
          '-ms-overflow-style': 'none',
        },
        '.scrollbar-hidden::-webkit-scrollbar': {
          display: 'none',
        },
      }, ['responsive']);
    },
  ],
}

