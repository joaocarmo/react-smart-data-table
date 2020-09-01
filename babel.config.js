module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3.6',
        modules: 'umd',
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}
