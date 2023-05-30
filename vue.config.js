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
  runtimeCompiler: true,

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: 'vue-loader',
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        },
      ],
    },
  },
};
