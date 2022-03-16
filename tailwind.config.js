module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#397EEC',
        'click': '#005EF5',
        'hover': '#629EFF',
        'disabled': '#99C0FF',
        'bg': '#172B4B',
      }
    },
  },
  plugins: [],
}
