const features = require('../../../util/features')

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
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    }
  },
  address: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 240
  },
  distance: {
    type: Number,
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  placeId: {
    type: String,
    required: features.googleApi,
  },
})

restaurantSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
