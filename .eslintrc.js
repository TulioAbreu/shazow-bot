module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        "eslint:recommended",
        "prettier",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint"
    ],
    rules: {
        "array-bracket-spacing": ["error", "never"],
        "array-callback-return": ["error", {
            "allowImplicit": false,
            "checkForEach": false
        }],
        "arrow-spacing": ["error", {"before": true, "after": true}],
        "camelcase": ["error", {
            "allow": ["^UNSAFE_"],
            "properties": "never",
            "ignoreGlobals": true
        }],
        "no-mixed-operators": ["error", {
            "groups": [
              ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
              ["&&", "||"],
              ["in", "instanceof"]
            ],
            "allowSamePrecedence": true
        }],
        "no-trailing-spaces": "error",
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};