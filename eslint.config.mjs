// @ts-check
import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
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
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
)
