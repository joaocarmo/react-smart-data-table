/// <reference types="vitest/config" />
import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: command === 'serve' ? [react()] : [],
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
        'change-case',
        'clsx',
        'escape-string-regexp',
        'flat',
        'linkifyjs',
        'react',
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          'change-case': 'changeCase',
          clsx: 'clsx',
          'escape-string-regexp': 'escapeStringRegexp',
          flat: 'flat',
          linkifyjs: 'linkifyjs',
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
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
}))
