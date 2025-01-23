/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import nextJest from 'next/jest.js'

import { type Config } from '@jest/types'

const createJestConfig = nextJest({
  dir: './'
})

const customJestConfig: Config.InitialOptions = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  injectGlobals: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // Handle CSS imports (with CSS modules)
    // https://jestjs.io/docs/webpack#mocking-css-modules
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$':
      '<rootDir>/__mocks__/fileMock.js',
    // Handle @next/font
    '@next/font/(.*)': '<rootDir>/__mocks__/nextFontMock.js',
    // Disable server-only
    'server-only': '<rootDir>/__mocks__/empty.js',
    '@mdxeditor/editor/style.css': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
    '!**/*.test.{js,jsx,ts,tsx}',
    '!types/**/*',
    '!**/index.{js,ts}',
    '!components/ui/**',
    '!app/layout.tsx',
    '!app/root-providers.tsx'
  ],
  coverageReporters: ['text', 'lcov', 'cobertura'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        reportTestSuiteErrors: true,
        ancestorSeparator: ' › ',
        uniqueOutputName: 'false',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        addFileAttribute: 'true'
      }
    ]
  ],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json'
      }
    ]
  },
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/**/*.{test}.{ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/out/',
    '/e2e/',
    '/.next/',
    '/.git/',
    '/.cache/',
    '/.output/',
    '/.temp/'
  ]
}

export default createJestConfig(customJestConfig)
