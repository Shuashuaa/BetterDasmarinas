import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The footer used to hard-code its version string, which had already drifted
// (it read 1.0.0 while package.json said 0.2.0). Injecting it at build time
// makes package.json the single source of truth.
const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
) as { version: string };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.md'],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
});
