const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const outFolder = 'docs'

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development'

  return [
    {
      entry: {
        index: './src/index.js',
        polyfills: './src/polyfills.js',
      },
      output: {
        filename: '[name].es6.js',
        path: path.resolve(__dirname, outFolder)
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: devMode
          }),
        ],
      },
      plugins: [
        new CleanWebpackPlugin([outFolder]),
        new HtmlWebpackPlugin({
          filename: 'index.html',
          favicon: 'favicon.png',
          template: 'index-tpl.html',
          excludeChunks: ['polyfills', 'index']
        })
      ],
      devtool: devMode ? 'source-map' : false,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: {
                        browsers: [
                          'Chrome >= 60',
                          'Safari >= 10.1',
                          'iOS >= 10.3',
                          'Firefox >= 54',
                          'Edge >= 15',
                        ]
                      }
                    }
                  ]
                ],
                plugins: [
                  "syntax-async-functions",
                  "@babel/plugin-proposal-optional-chaining",
                  "@babel/plugin-proposal-class-properties",
                  "dynamic-import-webpack"
                ]
              }
            }


          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader', options: { url: false, sourceMap: devMode } },
              { loader: 'sass-loader', options: { sourceMap: devMode } },
              'postcss-loader'
            ]
          },
          {
            test: /\.json$/,
            use: [
              { loader: path.resolve(__dirname, 'loader', 'json-filter.js') }
            ]
          }
        ]
      }
    },
    {
      entry: {
        index: './src/index.js',
      },
      output: {
        filename: '[name].js',
        path: path.resolve(__dirname, outFolder)
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: devMode
          })
        ]
      },
      devtool: devMode ? 'source-map' : false,
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    "@babel/preset-env",
                    {
                      targets: "last 2 version, IE 11"
                    }
                  ]
                ],
                plugins: [
                  "syntax-async-functions",
                  "@babel/plugin-proposal-optional-chaining",
                  "@babel/plugin-proposal-class-properties",
                  "dynamic-import-webpack"
                ]
              }
            }
          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              { loader: 'style-loader' },
              { loader: 'css-loader', options: { url: false, sourceMap: devMode } },
              { loader: 'sass-loader', options: { sourceMap: devMode } },
              'postcss-loader'
            ]
          },
          {
            test: /\.json$/,
            use: [
              { loader: path.resolve(__dirname, 'loader', 'json-filter.js') }
            ]
          }
        ]
      }
    }
  ]
}
