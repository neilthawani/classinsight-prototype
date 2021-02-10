const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const outputDirectory = 'dist';

module.exports = [
    // {
    //     target: 'node'
    // },
    {
        entry: ['babel-polyfill', '../server.js'],
        output: {
            path: path.join(__dirname, outputDirectory),
            filename: 'bundle.js',
            publicPath: '/'
        },
        module: {
            rules: [{
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [ 'url-loader?limit=100000' ]
            }
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            fallback: {
              "fs": require.resolve("file-system"),
              "file-system": require.resolve("file-system"),
              "child_process": require.resolve("child_process"),
              "aws4": require.resolve("aws4"),
              "mongodb-client-encryption": require.resolve("mongodb-client-encryption"),
              "net": require.resolve("net"),
              "dns": require.resolve("dns"),
              "tls": require.resolve("tls"),
              "module": require.resolve("module"),
              "util": require.resolve("util/"),
              "querystring": require.resolve("querystring-es3"),
              "os": require.resolve("os-browserify/browser"),
              "crypto": require.resolve("crypto-browserify"),
              "require_optional": require.resolve("require_optional"),
              "assert": require.resolve("assert/"),
              "zlib": require.resolve("browserify-zlib"),
              "buffer": require.resolve("buffer/"),
              "path": require.resolve("path-browserify"),
              "stream": require.resolve("stream-browserify"),
              "http": require.resolve("stream-http"),
              "url": require.resolve("url/"),
              "constants": require.resolve("constants-browserify")
            }
        },
        target: 'web',
        externals: [ nodeExternals() ],
        devServer: {
            port: 3000,
            open: true,
            historyApiFallback: true,
            proxy: {
               '/api/**': {
                  target: 'http://localhost:8802/',
                  secure: false,
                  logLevel: 'debug'
               }
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
    }
];
