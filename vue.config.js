'use strict';

const {join} = require('path');
const port = process.env.port || process.env.npm_config_port || 80;

module.exports = {
    pages: {
        index: 'src/main.js',
    },
    outputDir: join(__dirname, 'dist'),
    filenameHashing: false,
    productionSourceMap: false,
    publicPath: './',
    devServer: {
        port,
        disableHostCheck: true,
        contentBase: [join(__dirname, 'public')],
        proxy: {
            '/devProxy': {
                target: 'http://localhost:8082',
                changeOrigin: true,
                pathRewrite: {
                    '/devProxy': '/'
                }
            }
        }
    },
    configureWebpack: {
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: 'citrus',
        resolve: {
            alias: {
                '@': join(__dirname, 'src'),
            },
        }

    },
};
