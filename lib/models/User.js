const mongoose = require('mongoose');
const { hash, compare } = require('../utils/hash');
const { tokenize, untokenize } = require('../utils/token');
const { getAllRoles } = require('./roles');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    required: [true, 'Role required'],
    enum: getAllRoles()
  },

  username: {
    type: String,
    required: [true, 'Username required']
  },

  passwordHash: {
    type: String
  },

  name: {
    type: String,
    require: [true, 'Name required']
  },

  email: {
    type: String,
    required: [true, 'Email required']
  },

  phone: {
    type: String,
    required: [true, 'Phone number required']
  },

  address: {
    type: Object
  },

  logo: {
    type: String
  },

  bio: {
    type: String
  }
},

{
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.passwordHash;
    }
  }
});

userSchema.virtual('password').set(function(password) {
  this._tempPassword = password;
});

userSchema.pre('save', function(next) {
  hash(this._tempPassword)
    .then(hashedPassword => {
      this.passwordHash = hashedPassword;
      next();
    });
});

userSchema.methods.authToken = function() {
  return tokenize(this.toJSON());
};

userSchema.methods.compare = function(password) {
  return compare(password, this.passwordHash);
};

userSchema.statics.findByToken = function(token) {
  return Promise.resolve(untokenize(token));
};

module.exports = mongoose.model('User', userSchema);
