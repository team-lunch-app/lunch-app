const NodeEnvironment = require('jest-environment-node')
const MongodbMemoryServer = require('mongodb-memory-server')

class MongoDBEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)
    this.mongodb = new MongodbMemoryServer.default({
      instance: {
      },
      binary: {
        version: '3.6.1',
      },
    })
  }

  async setup() {
    await super.setup()
    this.global.MONGODB_URI = await this.mongodb.getConnectionString()
    this.global.MONGODB_NAME = await this.mongodb.getDbName()
  }

  async teardown() {
    await super.teardown()
    await this.mongodb.stop()
  }

  runScript(script) {
    return super.runScript(script)
  }
}

module.exports = MongoDBEnvironment
