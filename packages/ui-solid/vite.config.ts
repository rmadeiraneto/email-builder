import { defineConfig } from 'vite';
import { resolve } from 'path';
import solid from 'vite-plugin-solid';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        canvas: resolve(__dirname, 'src/canvas/index.ts'),
        sidebar: resolve(__dirname, 'src/sidebar/index.ts'),
        toolbar: resolve(__dirname, 'src/toolbar/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', '@email-builder/core', '@email-builder/tokens', '@email-builder/ui-components'],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [
    solid(),
    // Temporarily disable type generation to speed up development
    // dts({
    //   include: ['src/**/*'],
    //   exclude: ['**/*.test.ts', '**/*.test.tsx'],
    //   insertTypesEntry: true,
    // }),
  ],
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@use "@email-builder/tokens/scss" as tokens;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@tokens': resolve(__dirname, '../tokens/build/scss'),
    },
    conditions: ['development', 'browser'],
  },
});
