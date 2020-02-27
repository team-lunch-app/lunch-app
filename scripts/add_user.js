/* eslint-disable no-undef */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../server/config')
const User = require('../server/models/user')

const connectToDb = async () => {
  try {
    await mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: config.dbName,
    })
  } catch (error) {
    console.error('Connecting to database failed:', error)
    process.exit(1)
  }
}

const addUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds)
  return new User({
    username: username,
    password: passwordHash,
  }).save()
}

const parseArgs = () => {
  const argv = process.argv
  const usernameArg = argv.find(arg => arg.startsWith('--username='))
  const passwordArg = argv.find(arg => arg.startsWith('--password='))

  if (!usernameArg || !passwordArg) {
    console.error('One or more required parameters were not provided!')
    console.warn('Usage: yarn add-user --username=<username> --password=<password>')
    
    process.exit(1)
  }

  const username = usernameArg.substring(11).trim()
  const password = passwordArg.substring(11)

  if (username.length < 3) {
    console.error('username too short!')
    process.exit(1)
  }

  if (password.length < 6) {
    console.error('password too short!')
    process.exit(1)
  }

  return { username, password }
}

const main = async () => {
  connectToDb()

  const { username, password } = parseArgs()

  try {
    const user = await addUser(username, password)
    console.info(`Created user with name "${user.username}" and password "**REDACTED**"`)
  } catch (error) {
    console.error('Creating user failed:', error)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log('Success!')
    process.exit(0)
  })
  .catch(error => {
    console.error('Unexpected error', error)
    process.exit(1)
  })
