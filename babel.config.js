module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        modules: 'umd',
        corejs: '3.6',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
}
