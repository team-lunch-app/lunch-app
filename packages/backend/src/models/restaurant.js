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
    minlength: 1,
    maxlength: 240
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ]
})

restaurantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
