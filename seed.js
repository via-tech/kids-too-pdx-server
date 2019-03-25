require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
// const seedData = require('./tests/seedData');
const data = require('./lib/utils/csvParser');


data ({})
  .then(() => console.log('done'))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());

// seedData(100)
//   .then(() => console.log('done'))
//   .catch(err => console.error(err))
// .finally(() => mongoose.connection.close());

