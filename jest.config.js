module.exports = {
  // Other Jest configurations...

  testMatch: ['<rootDir>/src/**/*.spec.[jt]s?(x)'],

  // Other Jest configurations...
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/CheckList/store$':
      '<rootDir>/src/components/CheckList/store.ts',
  },
  moduleFileExtensions: ['js', 'json', 'vue', 'spec.js'],
  preset: '@vue/cli-plugin-unit-jest',
  silent: true,
};
