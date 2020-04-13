import path from 'path';
import webpack from 'webpack';

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

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats);
    });
  });
};