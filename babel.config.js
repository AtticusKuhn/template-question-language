// babel.config.js
module.exports = {
    "plugins": [],
    presets: [
        ["next/babel"],
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
    ],
};