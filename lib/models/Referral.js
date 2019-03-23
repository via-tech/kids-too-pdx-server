const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  user: {
    type: String,
    required: [true, 'user required']
  },

  eventName: {
    type: String,
    required: [true, 'event name required']
  },

  date: {
    type: Date,
    required: [true, 'referral date required'],
    default: Date.now()
  }
});

module.exports = mongoose.model('Referral', referralSchema);
