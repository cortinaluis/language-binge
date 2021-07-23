const Crx = require('crx-webpack-plugin');
module.exports = {
    plugins: [
        new Crx({
            keyFile: 'key.pem',
            contentPath: 'build',
            outputPath: 'dist',
            name: 'chrome-ext'
        })
    ]
};