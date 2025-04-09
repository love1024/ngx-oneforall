// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@angular-eslint/directive-selector": ["off"],
      "@angular-eslint/component-selector": ["off"],
    },
  },
  {
    files: ["**/*.html"],
    rules: {},
  },
);
