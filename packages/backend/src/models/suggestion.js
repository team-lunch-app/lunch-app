const mongoose = require('mongoose')
require('./restaurant')
const restaurantSchema = require('mongoose').model('Restaurant').schema
mongoose.set('useFindAndModify', false)

const suggestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['ADD', 'REMOVE'],
  },
  data: {
    type: restaurantSchema,
    required: true,
  }
})

suggestionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Suggestion', suggestionSchema)
