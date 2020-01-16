const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 240
  },
  url: {
    type: String,
    required: false,
    minlength: 3,
    maxlength: 240
  }
})

restaurantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
