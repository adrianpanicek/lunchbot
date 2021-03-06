const _ = require('lodash');
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const src = (subdir) => path.join(__dirname, "src", subdir);

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: 'source-map',
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      "@app": src('./')
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: !slsw.lib.webpack.isLocal
        }
      },
    ],
  },
  plugins: !slsw.lib.webpack.isLocal? [new ForkTsCheckerWebpackPlugin()] : undefined
};