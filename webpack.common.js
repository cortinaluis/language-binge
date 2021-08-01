const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const distFolder = path.resolve(__dirname, 'dist');
const extensionFolder = path.resolve(__dirname, 'src/extension');
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  optimization: {
    minimize: isProd,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        terserOptions: {
          compress: {
            drop_console: isProd,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(extensionFolder, 'language-binge.css'),
          to: distFolder,
        },
        {
          from: path.resolve(extensionFolder, 'manifest.json'),
          to: distFolder,
        },
        { from: path.resolve(extensionFolder, 'logo-16.png'), to: distFolder },
        { from: path.resolve(extensionFolder, 'logo-48.png'), to: distFolder },
        { from: path.resolve(extensionFolder, 'logo-128.png'), to: distFolder },
        {
          from: path.resolve(extensionFolder, 'typography.png'),
          to: distFolder,
        },
        { from: path.resolve(extensionFolder, 'popup.html'), to: distFolder },
        { from: path.resolve(extensionFolder, 'popup.css'), to: distFolder },
      ],
    }),
    // todo: review this
    new ZipPlugin({
      filename: path.resolve(__dirname, 'dist.zip'),
    }),
  ],
  entry: {
    content: path.resolve(extensionFolder, 'content.js'),
    popup: path.resolve(extensionFolder, 'popup.js'),
    background: path.resolve(extensionFolder, 'background.js'),
  },
  mode: 'none',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.css', '.js', '.html'],
  },
  output: { filename: '[name].js', path: path.resolve(__dirname, distFolder) }, // chrome will look for files under dist/* folder
};
