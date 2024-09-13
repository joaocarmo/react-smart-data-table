// @ts-check
const esmModules = ['change-case', 'escape-string-regexp', 'flat'].join('|')

/** @type {import('jest').Config} **/
const config = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/lib/__mocks__/fileMock.ts',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  resetMocks: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testRegex: '\\.test\\.[jt]sx?$',
  transformIgnorePatterns: [
    `<rootDir>/node_modules/(?!(?:.pnpm/)?(${esmModules}))`,
  ],
}

module.exports = config
