module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
        "jest": true
    },
    "globals": {
      "window": true,
      "console": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
      "react"
    ],
    "parser": "babel-eslint",
    "rules": {
        // React Rules
        "react/prop-types": 0,
        // "react/forbid-foreign-prop-types": 0,
        // "react/no-unknown-property": 0,

        // General Rules
        "no-console": 0,
        "no-unused-vars": 0,
        "no-case-declarations": 0,
        // "indent": [
        //     "error",
        //     2
        // ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
}
