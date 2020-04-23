const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const statisticsSchema = new mongoose.Schema({
  decidedAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  notSelectedAmount: {
    type: Number,
    required: true,
    default: 0
  },
  selectedAmount: {
    type: Number,
    required: true,
    default: 0
  },
})

statisticsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Statistics', statisticsSchema)
