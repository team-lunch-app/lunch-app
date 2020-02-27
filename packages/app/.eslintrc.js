module.exports = {
  'settings': {
    'react': {
      'version': 'detect'
    }
  },
  'env': {
    'browser': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    '../../.eslintrc.js'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
}
