module.exports = (ctx) => ({
  parser: ctx.parser ? 'sugarss' : false,
  map: ctx.env === 'development' ? ctx.map : false,
  plugins: {
    'postcss-preset-env': {},
    'postcss-import': {},
    autoprefixer: {},
    cssnano: ctx.env === 'production' ? {} : false,
  },
});
