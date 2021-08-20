const webpack = require('webpack');
const path = require('path');
const mode = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === "production" ? "production" : "development";
const output_filename = mode === "development" ? 'app.js' : 'app.js';

module.exports = {
  mode: mode,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: output_filename
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        loader: [ "eslint-loader" ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin(),
    // new HtmlWebpackPlugin({template: './index.html'})
  ]
};
