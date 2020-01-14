const path = require('path')

const staticDir = path.join(__dirname, '..', 'build')
const port = process.env.PORT || 3001

module.exports = {
  port,
  staticDir
}
