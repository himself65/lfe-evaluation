const autoprefixer = require('autoprefixer')
const mqpacker = require('css-mqpacker')
const path = require('path')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      template: path.resolve(__dirname, 'index.html'),
      filename: 'index.html'
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            browsers: ['>0.5%', 'last 2 versions', 'not dead', 'not op_mini all']
          }),
          mqpacker()
        ]
      }
    }
  },
  devServer: {
    proxy: {
      '^/(paint|board)': {
        target: 'http://localhost:3003',
        changeOrigin: false
      }
    }
  }
}
