import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        builder: resolve(__dirname, 'builder/index.ts'),
        commands: resolve(__dirname, 'commands/index.ts'),
        components: resolve(__dirname, 'components/index.ts'),
        services: resolve(__dirname, 'services/index.ts'),
        template: resolve(__dirname, 'template/index.ts'),
        types: resolve(__dirname, 'types/index.ts'),
        'compatibility/index': resolve(__dirname, 'compatibility/index.ts'),
        'tips/index': resolve(__dirname, 'tips/index.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [
    dts({
      include: ['src/**/*', 'builder/**/*', 'commands/**/*', 'components/**/*', 'services/**/*', 'template/**/*', 'types/**/*', 'compatibility/**/*', 'tips/**/*'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
