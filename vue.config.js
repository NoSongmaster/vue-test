module.exports = {
  css: {
    loaderOptions: {
      // 给 less-loader 传递选项
      less: {
        javascriptEnabled: true
      },
      postcss: {
        // 这里的选项会传递给 postcss-loader
        javascriptEnabled: true
      }
    }
  }
};
