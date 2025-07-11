const plugins = [];

export default {
  arrowParens: 'always',
  bracketSameLine: false,
  multilineArraysWrapThreshold: 2,
  plugins: plugins,
  printWidth: 100,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  overrides: [
    {
      files: "*.json",
        options: {
        tabWidth: 4,
        trailingComma: "none",
      }
    }
  ]
};
