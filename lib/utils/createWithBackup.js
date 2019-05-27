require('dotenv').config();
const connect = require('./connect');
const mongoose = require('mongoose');

const dbUris = [
  process.env.MONGODB_URI,
  process.env.MONGODB_URI_BACKUP_1
];

module.exports = (Model, data) => {
  Promise.all(dbUris.map(dbUri => {
    connect(dbUri);
    return Model
      .create(data)
      .then(createdData => {
        mongoose.connection.close();
        return createdData;
      })
      .catch(err => err);
  }))
    .then(res => {
      console.log('res', res);
      return res;
    });
};
