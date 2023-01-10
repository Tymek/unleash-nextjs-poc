module.exports = {
    presets: [require('@vercel/examples-ui/tailwind')],
    content: [
      './components/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './node_modules/@vercel/examples-ui/**/*.js',
    ],
  }
  