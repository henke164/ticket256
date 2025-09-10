/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const prettier = require("eslint-plugin-prettier");

module.exports = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        fetch: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "no-console": "off",
      "no-debugger": "off",
      "no-useless-escape": "off",
      "no-prototype-builtins": "off",
      "no-undef": "error",
      "linebreak-style": "off",
      curly: ["error", "all"],
    },
  }
);