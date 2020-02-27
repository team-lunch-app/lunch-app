const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 240
  },
  password: {
    type: String,
    required: true,
  }
})
userSchema.plugin(require('mongoose-unique-validator'))

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

module.exports = mongoose.model('User', userSchema)
