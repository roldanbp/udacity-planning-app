const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
    entry: './src/client/js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      publicPath: './',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                }
            },
            {
              test: /\.(s[ac]ss|css)$/,
              use: [
                "style-loader",
                "css-loader",
                "sass-loader",
              ],
            }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/client/views/index.html",
        filename: "../dist/view/index.html",
      }),
      new CopyPlugin({
        patterns: [
          { from: "./src/client/media", to: "assets" },
        ],
      }),
    ]
}