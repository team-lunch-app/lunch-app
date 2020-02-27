module.exports = {
  'env': {
    'es6': true,
    'jest': true
  },
  'parserOptions': {
    'ecmaVersion': 2018,
  },
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'rules': {
    'indent': [
      'warn',
      2,
      { 'SwitchCase': 1 }
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'eol-last': [
      'warn'
    ]
  }
}
