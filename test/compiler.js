import path from 'path';
import webpack from 'webpack';
import webpackFs from './lib/webpackFs.js'; 

export default (fixture, options = {}) => {
  const compiler = webpack({
    mode: 'development',
    context: __dirname,
    entry: `./fixtures/${fixture}.html`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: path.resolve(__dirname, '../index.js'),
            options,
          }
        ]
      }]
    }
  });

  compiler.outputFileSystem = webpackFs;
  compiler.resolvers.context.fileSystem = webpackFs;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.hasErrors()) {
        reject(new Error(stats.toJson().errors));
      }
      resolve(stats);
    });
  });
};