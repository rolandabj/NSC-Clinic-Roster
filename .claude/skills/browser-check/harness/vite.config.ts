// Test page only (browser-check skill): serves the app's screens from _preview/ with the
// database and sign in swapped for in memory fakes, so no Firebase is needed.
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

const repoRoot = path.resolve(__dirname, '..');
const swaps: Record<string, string> = {
  [path.join(repoRoot, 'src/services/repository/index.ts')]: path.join(__dirname, 'fakeRepo.ts'),
  [path.join(repoRoot, 'src/services/auth/authService.ts')]: path.join(__dirname, 'fakeAuth.ts'),
};

/** Every import of the real database or sign in module gets the fake instead. */
function fakes(): Plugin {
  return {
    name: 'fakes',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!importer || importer.includes('/_preview/fake')) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (resolved && swaps[resolved.id]) return swaps[resolved.id];
      return null;
    },
  };
}

export default defineConfig({
  root: __dirname,
  plugins: [fakes(), react(), tailwindcss()],
  resolve: { dedupe: ['react', 'react-dom'] },
  server: { fs: { allow: [repoRoot] }, hmr: false },
});
