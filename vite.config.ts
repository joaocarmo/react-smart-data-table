/// <reference types="vitest/config" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@withshepherd/faker'],
  },
  server: {
    port: 3000,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'SmartDataTable',
      formats: ['es', 'umd'],
      fileName: (format) =>
        format === 'umd'
          ? 'react-smart-data-table.umd.js'
          : 'react-smart-data-table.es.js',
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'clsx',
        'escape-string-regexp',
        'flat',
        'linkifyjs',
      ],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          clsx: 'clsx',
          'escape-string-regexp': 'escapeStringRegexp',
          flat: 'flat',
          linkifyjs: 'linkifyjs',
        },
        assetFileNames: 'react-smart-data-table.[ext]',
      },
    },
    outDir: 'dist',
    cssCodeSplit: false,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['lib/**/*.test.{ts,tsx}'],
    css: true,
    mockReset: false,
  },
})
