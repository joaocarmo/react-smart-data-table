import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

/**
 * Vite plugin to handle non-UTF-8 files (e.g., ISO-8859-1 encoded locale
 * files in @withshepherd/faker) by converting them to UTF-8.
 */
function latin1Plugin(): Plugin {
  return {
    name: 'latin1',
    load(id) {
      if (id.includes('@withshepherd/faker') && id.endsWith('.js')) {
        try {
          const buf = readFileSync(id)
          const utf8 = buf.toString('utf-8')

          // Quick check: if it parses as valid UTF-8 with no replacement
          // chars, return as-is. Otherwise, re-decode as Latin-1.
          if (utf8.includes('\uFFFD')) {
            return buf.toString('latin1')
          }

          return utf8
        } catch {
          return undefined
        }
      }

      return undefined
    },
  }
}

export default defineConfig({
  plugins: [latin1Plugin(), react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
