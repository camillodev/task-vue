const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass'),
        sassOptions: {
          indentedSyntax: false,
        },
      },
    },
  },
  transpileDependencies: true,

  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },
};
