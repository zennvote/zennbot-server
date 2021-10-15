module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-shadow': 0,
    'no-useless-constructor': 0,
    'no-use-before-define': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'max-len': ['error', { code: 160 }],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-empty-function': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts'],
      },
    },
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        'no-unused-expressions': 0,
      },
    },
  ],
};
