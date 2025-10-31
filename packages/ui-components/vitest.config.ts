import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/node_modules/**', '**/dist/**', '**/*.module.scss'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../tokens/build/ts'),
      'datatalks-utils': resolve(__dirname, '../../src/js/DataTalksUtils/_index.js'),
      'datatalks-ui': resolve(__dirname, '../../src/js/DataTalksUI/_index.js'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
});
