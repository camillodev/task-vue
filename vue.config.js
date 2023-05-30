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
  transpileDependencies: ['vue', 'vuex', 'vue-router'],

  chainWebpack: (config) => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));

    config.resolve.extensions.add('.ts').add('.vue').add('.js');

    config.entry('app').clear().add('./src/main.ts');

    config.module
      .rule('ts')
      .test(/\.ts$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/],
      });
  },
};
