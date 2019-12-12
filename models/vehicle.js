const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const Schema = mongoose.Schema

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String
  },
  brand: {
    type: String,
    require: true
  },
  model: {
    type: String,
    require: true
  },
  license: {
    type: String,
    unique: true
  },
  year: {
    type: String
  },
  km: {
    type: Number
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'Users',
    unique: true,
    lowercase: true,
    trim: true
  },
  events: {
    type: String
  }
})

module.exports = mongoose.model('Vehicles', vehicleSchema)
