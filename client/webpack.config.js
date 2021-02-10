const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
    entry: ['babel-polyfill', '../server.js'],
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js|\.jsx$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            use: {
              loader: 'url-loader?limit=100000'
            }
        }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        fallback: {
          "util": require.resolve("util/"),
          "querystring": require.resolve("querystring-es3"),
          "os": require.resolve("os-browserify/browser"),
          "crypto": require.resolve("crypto-browserify"),
          "assert": require.resolve("assert/"),
          "zlib": require.resolve("browserify-zlib"),
          "buffer": require.resolve("buffer/"),
          "path": require.resolve("path-browserify"),
          "stream": require.resolve("stream-browserify"),
          "http": require.resolve("stream-http"),
          "url": require.resolve("url/")
        }
    },
    devServer: {
        port: 3000,
        open: true,
        historyApiFallback: true,
        proxy: {
            '/api': 'http://localhost:8802',
        },
        disableHostCheck: true
    },
    plugins: [
        new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: [outputDirectory] }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico'
        })
    ]
};
