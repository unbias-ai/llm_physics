// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup/webgl-mock.ts', '<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(test).[jt]s?(x)'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '\\.spec\\.[jt]s$',
    '/__tests__/setup/'
  ],
  moduleNameMapper: {
    '^next/font/(.*)$': '<rootDir>/mocks/nextFontMock.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^@/hooks/usePyodideSolver$': '<rootDir>/__mocks__/usePyodideSolver.ts',
    '^../hooks/usePyodideSolver$': '<rootDir>/__mocks__/usePyodideSolver.ts'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react'
      }
    }]
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'html', 'json-summary'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/layout.tsx',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!hooks/usePyodideSolver.ts', // Web Worker import.meta not supported in Jest
    '!workers/**' // Web Workers not testable in Jest
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
