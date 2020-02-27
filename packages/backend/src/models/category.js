const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 240
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  ]
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Category', categorySchema)
