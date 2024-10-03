module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          components: './components',
          screens: './screens',
          // Add more aliases if necessary
        },
      },
    ],
  ],
};
