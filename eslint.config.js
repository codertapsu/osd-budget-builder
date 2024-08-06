// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

const config = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/no-input-rename": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/explicit-function-return-type": [
        "warn",
        {
          allowExpressions: true,
          allowFunctionsWithoutTypeParameters: true,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
          overrides: {
            accessors: "off",
            constructors: "explicit",
            methods: "explicit",
            properties: "explicit",
            parameterProperties: "explicit",
          },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^[_]*$",
          varsIgnorePattern: "^[_]*$",
          caughtErrorsIgnorePattern: "^[_]*$",
        },
      ],
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          fixToUnknown: true,
          ignoreRestArgs: true,
        },
      ],
    },
    ignores: [
      "package.json",
      "package-lock.json",
      "build",
      "e2e",
      "prettier.config.js",
      "*.spec.ts",
      "*.js",
      "!*.spec.js",
    ],
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "@angular-eslint/template/no-negated-async": "warn",
    },
  },
);

module.exports = config;
