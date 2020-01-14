const express = require('express')
const path = require('path')
const app = express();
const cors = require('cors')

const config = require('./config')

app.use(express.static(config.staticDir))
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(path.join(config.staticDir, 'index.html'))
})

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
