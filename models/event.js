const mongoose = require('mongoose');
<<<<<<< HEAD
mongoose.set('useCreateIndex', true);
=======
>>>>>>> bc3979e4adcb63e98f6cba282648a38ff2b2a3b8
const Schema = mongoose.Schema;

// User Schema
const EventSchema = mongoose.Schema({
<<<<<<< HEAD
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
    ref: 'User',
    lowercase: true,
    trim: true
  }
});

const Event = (module.exports = mongoose.model('Event', EventSchema));

module.exports.addEvent = function(newEvent, callback) {
  newEvent.save(callback);
};

module.exports.getEventById = function(id, callback) {
  Event.findById(id, callback);
};

module.exports.editEvent = function(id, callback) {
  Event.findOneAndUpdate(id, callback);
};

module.exports.deleteEvent = function(id, callback) {
  Event.findByIdAndRemove(id, callback);
};
=======
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true,
    },
    license: {
        type: String,
        ref: 'Vehicle',
        trim: true
    },
    cost: {
        type: String,
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        lowercase: true,
        trim: true
    }
});

const Event = module.exports = mongoose.model('Event', EventSchema);

module.exports.addEvent = function (newEvent, callback) {
    newEvent.save(callback);
};

module.exports.getEventById = function (id, callback) {
    Event.findById(id, callback);
}

module.exports.editEvent = function (id, callback) {
    Event.findOneAndUpdate(id, callback);
}

module.exports.deleteEvent = function (id, callback) {
    Event.findByIdAndRemove(id, callback);
}
>>>>>>> bc3979e4adcb63e98f6cba282648a38ff2b2a3b8
