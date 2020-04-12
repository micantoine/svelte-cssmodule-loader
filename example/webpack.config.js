const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve(__dirname, 'main.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: [
          {
            loader: 'svelte-loader',
            options: {
              emitCss: false
            }
          },
          {
            loader: path.resolve(__dirname, '../index.js'),
            options: isProduction ? {
              localIdentName: '[hash:base64:10]'
            } : {}
          }
        ]
      }
    ]
  }
};