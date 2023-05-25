module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': 'vue-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
  snapshotSerializers: ['jest-serializer-vue'],
  testEnvironment: 'jsdom',
};
