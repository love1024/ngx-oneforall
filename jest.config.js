const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/src/test.ts',
    '<rootDir>/projects/ngx-oneforall-docs/',
    '.*-provider\\.ts$',
    '.*-context\\.ts$',
  ],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },
  collectCoverageFrom: [
    '<rootDir>/projects/ngx-oneforall-lib/**/*.ts',
    '!<rootDir>/projects/ngx-oneforall-lib/**/*-provider.ts',
    '!<rootDir>/projects/ngx-oneforall-lib/**/*-context.ts',
    '!<rootDir>/projects/ngx-oneforall-lib/**/public_api.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // Make sure Jest only treats *.spec.ts as test files
  testMatch: ['**/?(*.)+(spec).[jt]s?(x)'],
  testEnvironment: 'jsdom',
};
