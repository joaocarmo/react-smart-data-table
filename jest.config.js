module.exports = {
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/lib/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  resetMocks: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*)\\.[jt]sx?$',
  transformIgnorePatterns: ['node_modules/(?!escape-string-regexp)'],
}
