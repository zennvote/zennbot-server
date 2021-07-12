module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'import/extensions': 0,
    'import/prefer-default-export': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
};
