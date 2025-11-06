import { defineConfig } from 'vite';
import { resolve } from 'path';
import solid from 'vite-plugin-solid';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/email-builder/' : '/',
  plugins: [solid()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../../packages/tokens/build/scss/_variables.scss'),
      '@email-builder/core/tips': resolve(__dirname, '../../packages/core/tips'),
      '@email-builder/core/compatibility': resolve(__dirname, '../../packages/core/compatibility'),
      '@email-builder/core/utils': resolve(__dirname, '../../packages/core/utils'),
      '@email-builder/core/config': resolve(__dirname, '../../packages/core/config'),
      '@email-builder/core': resolve(__dirname, '../../packages/core/src'),
      '@email-builder/ui-components': resolve(__dirname, '../../packages/ui-components'),
      '@email-builder/ui-solid': resolve(__dirname, '../../packages/ui-solid/src'),
      '@email-builder/ui-solid/canvas': resolve(__dirname, '../../packages/ui-solid/src/canvas'),
      '@email-builder/ui-solid/sidebar': resolve(__dirname, '../../packages/ui-solid/src/sidebar'),
      '@email-builder/ui-solid/toolbar': resolve(__dirname, '../../packages/ui-solid/src/toolbar'),
      '@email-builder/ui-solid/tips': resolve(__dirname, '../../packages/ui-solid/src/tips'),
    },
  },
  optimizeDeps: {
    exclude: ['@email-builder/ui-solid', '@email-builder/ui-components', '@email-builder/core'],
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@tokens" as tokens;\n`,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
