const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/demo.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'demo.js',
    library: 'FabricLayersReact',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM'
    },
    '@emotion/styled': {
      commonjs: '@emotion/styled',
      commonjs2: '@emotion/styled',
      amd: '@emotion/styled',
      root: 'emotionStyled'
    },
    '@emotion/react': {
      commonjs: '@emotion/react',
      commonjs2: '@emotion/react',
      amd: '@emotion/react',
      root: 'emotionReact'
    },
    'fabric-layers': {
      commonjs: 'fabric-layers',
      commonjs2: 'fabric-layers',
      amd: 'fabric-layers',
      root: 'FabricLayers'
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.demo.json'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}