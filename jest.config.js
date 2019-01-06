module.exports = {
  verbose: false,
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests/unit'
  ],
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  setupFiles: ['jest-canvas-mock'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@/test$': '<rootDir>/test/index.js',
    '^@/test/(.*)$': '<rootDir>/test/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '\\.(js)$': 'babel-jest',
    '\\.(vue)$': 'vue-jest'
  },
  collectCoverageFrom: [
    'app.js',
    'src/**/*.{js}',
    '!**/node_modules/**'
  ],
  transformIgnorePatterns: [
    'node_modules'
  ],
  coverageDirectory: './coverage/'
}
