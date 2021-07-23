const path = require('path');
const { version: packageVersion } = require('./package.json');

const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Crx = require('crx-webpack-plugin');

const unpackedFolder = path.resolve(__dirname, 'dist/unpacked');
const assetsFolder = path.resolve(__dirname, 'dist/assets');
const srcFolder = path.resolve(__dirname, 'src');
const distFolder = path.resolve(__dirname, 'dist');
const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: true,
            terserOptions: {
                compress: {
                    drop_console: isProd
                }
            }
        }), new CssMinimizerPlugin()],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/language-binge.css', to: distFolder },
                { from: 'src/manifest.json', to: distFolder }
            ]
        }),
        new ZipPlugin({
            filename: path.resolve(assetsFolder, 'dist.zip')
        }),
        new Crx({
            keyFile: '',
            contentPath: srcFolder,
            outputPath: assetsFolder,
            name: `language-binge-${packageVersion}`
        })
    ],
    entry: { content: './src/content.js' },
    mode: 'none',
    resolve: {
        extensions: ['.css', '.js'],
    },
    output: { filename: '[name].js', path: unpackedFolder }, // chrome will look for files under dist/* folder
};


module.exports = Object.assign;