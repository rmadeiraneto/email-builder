import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import solid from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solid()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**', '**/dist/**', '**/*.module.scss'],
    },
    deps: {
      optimizer: {
        web: {
          include: ['solid-js'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../tokens/build/ts'),
    },
    conditions: ['development', 'browser'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
