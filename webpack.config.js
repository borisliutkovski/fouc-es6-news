const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const outFolder = 'docs'

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development'

  return {
    entry: {
      index: './src/index.js',
      polyfills: './src/polyfills.js'
    },
    output: {
      filename: devMode ? '[name].js' : '[name].[contenthash].js',
      path: path.resolve(__dirname, outFolder)
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: devMode
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin([outFolder]),
      new MiniCssExtractPlugin({
        filename: devMode ? 'style.css' : 'style.[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        favicon: 'favicon.png',
        template: 'index.html',
        excludeChunks: ['polyfills']
      })
    ],
    devtool: devMode ? 'source-map' : false,
    module: {
      rules: [
        {
          test: /\.s?[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { url: false, sourceMap: devMode } },
            { loader: 'sass-loader', options: { sourceMap: devMode } },
            'postcss-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
    }
  }
}
