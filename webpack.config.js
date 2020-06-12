var path = require('path');
module.exports = {
    entry: {
        app :'./src/main.ts',
    },
    output: {
        path: path.resolve("./public/"),
        filename: 'bundle.js',
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
    },
    module: {
        loaders: [
            {
                exclude: /(node_modules)/,
                loaders: [ "babel-loader", "ts-loader" ],
            },
        ],
    },
};
