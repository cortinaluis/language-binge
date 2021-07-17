const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const distFolder = path.resolve(__dirname, 'dist');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/language-binge.css', to: distFolder },
        { from: 'src/manifest.json', to: distFolder }
      ]
    })
  ],
  entry: { content: './src/content.js' },
  mode: 'none',
  resolve: {
    extensions: ['.css', '.js'],
  },
  output: { filename: '[name].js', path: path.resolve(__dirname, distFolder) }, // chrome will look for files under dist/* folder
};
