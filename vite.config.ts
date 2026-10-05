import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';
import { createApiApp } from './server/apiApp';

/** AI Studio may launch Vite directly. Mount the same protected API before its SPA fallback. */
function clinicApi(): Plugin {
  return {
    name: 'clinic-api',
    configureServer(server) {
      // Express already owns the API when it embeds Vite in middleware mode.
      if (!server.config.server.middlewareMode) server.middlewares.use(createApiApp());
    },
    configurePreviewServer(server) {
      server.middlewares.use(createApiApp());
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [clinicApi(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      minify: 'esbuild' as const,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
