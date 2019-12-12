const mongoose = require('mongoose');
const Schema = mongoose.Schema

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  license: {
    type: String,
    ref: 'Vehicle',
    trim: true
  },
  cost: {
    type: String
  },
  owner: {
    type: Schema.ObjectId,
    ref: 'Users',
    lowercase: true,
    trim: true
  }
})

module.exports = mongoose.model('Events', EventSchema)