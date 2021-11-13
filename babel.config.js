module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: '3.19',
        modules: 'umd',
        useBuiltIns: 'usage',
        targets: { node: 'current' },
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: ['@babel/plugin-transform-runtime'],
}
