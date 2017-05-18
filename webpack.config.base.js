/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import { dependencies as externals } from './app/package.json';

export default {
    module: {
        loaders: [
            {
                test: /\.coffee$/,
                loader: "coffee-loader"
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },

    output: {
        path: path.join(__dirname, 'app'),
        filename: 'bundle.js',
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    // https://webpack.github.io/docs/configuration.html#resolve
    resolve: {
        extensions: [
            '.js', '.jsx', '.json', '.less'
        ],
        // packageMains: [
        //     'webpack',
        //     'browser',
        //     'web',
        //     'browserify',
        //     [
        //         'jam', 'main'
        //     ],
        //     'main'
        // ],
        alias: {
            'alias-redux': path.resolve(__dirname, './app/redux'),
            'alias-resources': path.resolve(__dirname, './resources'),
            'alias-utils': path.resolve(__dirname, './app/utils')
        }
    },

    plugins: [],

    externals: Object.keys(externals || {})
}
