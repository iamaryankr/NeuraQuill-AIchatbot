// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // By default, Vite will build from `frontend/index.html`
    // and output into `frontend/dist/`
    outDir: 'dist',
    emptyOutDir: true,
  },
});
