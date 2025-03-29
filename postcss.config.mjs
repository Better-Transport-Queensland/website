export const config = {
  plugins: [
    '@tailwindcss/postcss', // Pass the plugin as a string instead of using require()
    'autoprefixer', // Include Autoprefixer for browser compatibility
  ],
};