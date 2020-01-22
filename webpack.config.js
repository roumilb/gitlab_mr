var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'development',
    entry: './src/content/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './src/content_new/index.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
        ],
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'images',
                to: 'images',
            },
            {
                from: 'manifest.json',
                to: 'manifest.json',
            },
            {
                from: 'src/popup',
                to: 'src/popup',
            },
            {
                from: 'src/content_old',
                to: 'src/content',
            },
        ]),
    ],
};