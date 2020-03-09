const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../config')
const User = require('../models/user')

const connect = async () => {
  await mongoose.connect(config.dbUrl, {
    useNewUrlParser: true,
    dbName: config.dbName,
    useUnifiedTopology: true
  })
}

/**
 * Called to create a row to the database. Gets the index of the current entry being
 * created as a parameter for generating variations.
 * 
 * @callback dbRowFactory
 * @param {number} index - index of the entry being generated
 */

/**
 * Creates n row to the database, constructing each entry with the given factory.
 * 
 * @param {number} n 
 * @param {dbRowFactory} factory 
 */
const createRows = async (n, factory) => {
  const maybeRows = []
  for (var index = 0; index < n; ++index) {
    const entry = factory(index)
    maybeRows.push(entry.save())
  }

  return Promise.all(maybeRows)
}

/**
 * Creates database rows from given entries, using the given model.
 * 
 * @param {mongoose.Model} model - mongoose model to transform the entries into
 * @param {Object[]} entries -  array of entries to insert into the database. Assumed to 
 *                              be directly usable as constructor parameters for the model.
 */
const createRowsFrom = async (model, entries) => {
  return createRows(entries.length, (i) => new model(entries[i]))
}

const createUser = async (username, password) => {
  const passwordHash = await bcrypt.hash(password, config.bcryptSaltRounds)
  const user = new User({
    username: username,
    password: passwordHash
  })
  return user.save()
}


/**
 * Cleans up all database collections, tries to drop the database and finally closes
 * the DB connection.
 */
const cleanupAndDisconnect = async () => {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany(() => { })
  }

  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoose.disconnect()
}

module.exports = {
  connect,
  createRows,
  createRowsFrom,
  cleanupAndDisconnect,
  createUser
}
