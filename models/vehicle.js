const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;

// Vehicle Schema
const VehicleSchema = mongoose.Schema({
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
    ref: 'User',
    unique: true,
    lowercase: true,
    trim: true
  },
  events: {
    type: String
  }
});

const Vehicle = (module.exports = mongoose.model('Vehicle', VehicleSchema));

module.exports.addVehicle = function (newVehicle, callback) {
  newVehicle.save(callback);
};

module.exports.getVehicleById = function (id, callback) {
  Vehicle.findById(id, callback);
};

module.exports.getFleet = function (username, callback) {
  Vehicle.find(username, callback);
};

module.exports.editVehicle = function (id, callback) {
  Vehicle.findOneAndUpdate(id, callback);
};

module.exports.deleteVehicle = function (id, callback) {
  Vehicle.findByIdAndRemove(id, callback);
};