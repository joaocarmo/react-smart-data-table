module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3.8',
        modules: 'umd',
        useBuiltIns: 'usage',
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}
