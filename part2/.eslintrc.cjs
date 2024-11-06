module.exports = {
    env: {
        browser: true,
        es2020: true,
        "vitest-globals/env": true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:vitest-globals/recommended'
    ],
}