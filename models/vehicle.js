const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = mongoose.Schema({
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

const Vehicles = (module.exports = mongoose.model('Vehicles', vehicleSchema));

module.exports.addVehicle = function(newVehicle, callback) {
  newVehicle.save(callback);
};

module.exports.getVehicleById = function(id, callback) {
  Vehicles.findById(id, callback);
};

module.exports.getFleet = function(username, callback) {
  Vehicles.find(username, callback);
};

module.exports.editVehicle = function(id, callback) {
  Vehicles.findOneAndUpdate(id, callback);
};

module.exports.deleteVehicle = function(id, callback) {
  Vehicles.findByIdAndRemove(id, callback);
};