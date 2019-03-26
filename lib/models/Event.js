const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: String
  },

  name: {
    type: String,
    required: [true, 'event name required']
  },

  image: {
    type: String,
    default: 'https://paintncreate.com/wp-content/uploads/2018/03/Emoji-Week.png'
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
    type: Number,
    default: 1000
  },

  ageMin: {
    type: Number,
    default: 0
  },

  ageMax: {
    type: Number,
    default: 100
  },

  description: {
    type: String
  },

  category: {
    type: String
  },

  likes: {
    type: Number
  }
});

module.exports = mongoose.model('Event', eventSchema);
