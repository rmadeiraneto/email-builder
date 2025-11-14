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
        i18n: resolve(__dirname, 'src/i18n/index.ts'),
        tips: resolve(__dirname, 'src/tips/index.ts'),
        'visual-feedback': resolve(__dirname, 'src/visual-feedback/index.ts'),
        'atoms': resolve(__dirname, 'src/atoms/index.ts'),
        'molecules': resolve(__dirname, 'src/molecules/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [
        'solid-js',
        'solid-js/web',
        'solid-js/store',
        '@email-builder/core',
        '@email-builder/core/utils',
        '@email-builder/core/compatibility',
        '@email-builder/core/tips',
        '@email-builder/tokens',
        '@email-builder/ui-components',
        '@email-builder/ui-components/atoms',
        '@email-builder/ui-components/molecules',
        '@email-builder/ui-components/utils',
        /^@email-builder\/ui-components\/src\//,
        '@floating-ui/dom',
        // Lexical dependencies
        'lexical',
        '@lexical/code',
        '@lexical/history',
        '@lexical/html',
        '@lexical/link',
        '@lexical/list',
        '@lexical/react',
        '@lexical/rich-text',
        '@lexical/selection',
        '@lexical/utils',
        '@lexical/clipboard',
      ],
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
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      insertTypesEntry: true,
    }),
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
