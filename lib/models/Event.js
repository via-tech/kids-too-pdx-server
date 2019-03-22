const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: String
  },

  name: {
    type: String,
    required: [true, 'event name required']
  },

  date: {
    type: Date,
    required: [true, 'event date required']
  },

  location: {
    type: Object
  },

  time: {
    type: String
  },

  price: {
    type: Number
  },

  age: {
    type: Number
  },

  description: {
    type: String
  },

  pending: {
    type: Boolean,
    required: [true, 'pending state required']
  },

  category: {
    type: String
  },

  likes: {
    type: Number
  }
});

module.exports = mongoose.model('Event', eventSchema);
