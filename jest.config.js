const esModules = ['escape-string-regexp'].join('|')

module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/lib/helpers/tests.ts',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/lib/__mocks__/fileMock.ts',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  resetMocks: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testRegex: '\\.test\\.[jt]sx?$',
  transformIgnorePatterns: [`node_modules/(?!(${esModules}))`],
}
