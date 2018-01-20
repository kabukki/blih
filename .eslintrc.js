module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    node: true,
    'es6': true
  },
  extends: 'eslint:recommended',
  'rules': {
    'arrow-parens': 0,
    'no-unused-vars': [2, {
        'argsIgnorePattern': '^_'
    }]
  }
}
