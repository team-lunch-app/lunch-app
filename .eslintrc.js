module.exports = {
  'env': {
    'es6': true,
    'jest': true
  },
  'plugins': [
    'jest'
  ],
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
    ],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/valid-expect': 'error',
  }
}
