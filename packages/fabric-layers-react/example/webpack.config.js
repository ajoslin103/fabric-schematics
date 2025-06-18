const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: __dirname,
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'fabric': path.resolve(__dirname, '../node_modules/fabric'),
      'fabric-layers': path.resolve(__dirname, '../node_modules/fabric-layers'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, '../tsconfig.json'),
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: 'body',
    }),
  ],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    fabric: 'fabric',
    'fabric-layers': 'fabric-layers',
  },
  devtool: 'eval-source-map',
};
