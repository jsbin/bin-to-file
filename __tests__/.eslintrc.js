const res = Object.assign({}, require('@remy/eslint/jest'), {
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
});

module.exports = res;
