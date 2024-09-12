// @ts-check
import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
  },
  {
    ignores: [
      '.eslintrc.js',
      'babel.config.js',
      'coverage/',
      'jest.config.js',
      'webpack.config.js',
      'webpack.dev.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
)
