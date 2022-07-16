const webpack = require('webpack')
const path = require('path')

const config = {
  entry: ['react-hot-loader/patch', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'file-loader',
      },
    ],
  },
  devServer: {
    static: {
      directory: './dist',
    },
  },
}

module.exports = config
