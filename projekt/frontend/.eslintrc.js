module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "quotes": ["error", "double"]
    },
    overrides: [{
        files: ["*.vue"],
        rules: {
            "indent": "off",
            "vue/script-indent": ["error", 4, {
                "baseIndent": 1
            }],
            "vue/html-indent": ["error", 4, {
                "baseIndent": 1
            }],
            "vue/max-attributes-per-line": "off",
        }
    }]
};
