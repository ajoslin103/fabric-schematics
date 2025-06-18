const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './example/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'example.js',
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'fabric': path.resolve(__dirname, 'node_modules/fabric'),
      'fabric-layers': path.resolve(__dirname, 'node_modules/fabric-layers'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false,
      'os': require.resolve('os-browserify/browser')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
    }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
  ],
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'fabric': 'fabric',
    'fabric-layers': 'fabric-layers',
  },
  optimization: {
    nodeEnv: 'development',
  },
  devtool: 'eval-source-map',
  stats: 'minimal',
};
