module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/src/test.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
    '^.+\\.tsx?$': [
        'ts-jest',
        {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.html$',
        }
    ]
  },
  moduleNameMapper: {
    'ngx-oneforall-lib/(.*)': 'projects/ngx-oneforall-lib/src/app/$1',
  },
  testEnvironment: 'jsdom',
};