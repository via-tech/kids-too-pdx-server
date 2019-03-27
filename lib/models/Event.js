const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: String
  },

  pending: {
    type: Boolean  
  },

  name: {
    type: String
  },

  image: {
    type: String,
    default: 'https://paintncreate.com/wp-content/uploads/2018/03/Emoji-Week.png'
  },

  date: {
    type: Date
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

  ageMin: {
    type: Number
  },

  ageMax: {
    type: Number
  },

  description: {
    type: String
  },

  category: {
    type: String
  },

  likes: {
    type: Number
  },

  contact: {
    type: Object
  },

  reducedRate: {
    type: Boolean
  }
});

module.exports = mongoose.model('Event', eventSchema);
