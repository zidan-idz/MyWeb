// @ts-check
// import { defineConfig } from 'astro/config';
// import node from '@astrojs/node';
// import tailwindcss from '@tailwindcss/vite';

// // Dokumentasi Konfigurasi: https://astro.build/config
// export default defineConfig({
//   output: 'server',
//   adapter: node({
//     mode: 'standalone',
//   }),
//   vite: {
//     plugins: [tailwindcss()]
//   }
// });

// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless'; // Import adapter vercel
import tailwindcss from '@tailwindcss/vite';

// Dokumentasi Konfigurasi: https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(), // Gunakan adapter vercel
  vite: {
    plugins: [tailwindcss()]
  }
});