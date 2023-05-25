module.exports = {
  // Other Jest configurations...
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.js$': 'babel-jest',
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Other Jest configurations...
  moduleFileExtensions: ['js', 'json', 'vue'],

  preset: '@vue/cli-plugin-unit-jest',
  silent: true,
};
