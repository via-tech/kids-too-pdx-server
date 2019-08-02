const mongoose = require('mongoose');

const activateSchema = new mongoose.Schema({
  user: {
    type: String,
    require: [true, 'User required']
  },

  code: {
    type: String,
    required: [true, 'Code required']
  }
},

{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Activate', activateSchema);
