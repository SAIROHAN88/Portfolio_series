import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  // `loadEnv` is required because the config runs before Vite populates
  // `process.env` from .env — without it, VITE_BASE_PATH would be ignored.
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react(), tailwindcss()],
    // GitHub Pages project sites are served from a sub-path
    // (https://<user>.github.io/<repo>/), so every asset URL needs that prefix.
    // Set VITE_BASE_PATH=/ when deploying to a root domain or a host like
    // Vercel that serves from the domain root.
    base: env.VITE_BASE_PATH ?? '/Portfolio_series/',
    build: {
      target: 'es2020',
      rollupOptions: {
        input: {
          // The main site.
          main: resolve(import.meta.dirname, 'index.html'),
          // Print-only resume page. scripts/build-resume.mjs renders this to a
          // downloadable PDF, so the file always matches what the site shows.
          resume: resolve(import.meta.dirname, 'resume.html'),
        },
        output: {
          manualChunks: { motion: ['framer-motion'], react: ['react', 'react-dom'] },
        },
      },
    },
  };
});
