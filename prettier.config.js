/** @type {import("prettier").Config} */
const config = {
  useTabs: false,
  trailingComma: 'all',
  tabWidth: 2,
  singleQuote: true,
  overrides: [
    {
      files: 'prettier.config.js',
      options: { parser: 'typescript' },
    },
    {
      files: ['**/*.css', '**/*.scss'],
      options: {
        bracketSameLine: false,
        singleQuote: false,
        singleAttributePerLine: true,
      },
    },
    {
      files: ['**/*.html'],
      options: {
        bracketSameLine: false,
        singleAttributePerLine: true,
        printWidth: 160,
        htmlWhitespaceSensitivity: 'ignore',
      },
    },
  ],
  semi: true,
  printWidth: 120,
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'avoid',
};

module.exports = config;
