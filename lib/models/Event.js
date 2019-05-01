const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'User required']
  },

  name: {
    type: String
  },

  image: {
    type: String,
    default: 'https://www.kids-partycabin.com/images/601xNxkids-party-ideas.jpg.pagespeed.ic.BcdgHRTk4x.jpg'
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
  },

  website:  {
    type: String
  }
},
{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
  
});

module.exports = mongoose.model('Event', eventSchema);
