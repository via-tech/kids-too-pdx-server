require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
// const seedData = require('./tests/seedData');
const art = require('./lib/utils/artsParser');
const data = require('./lib/utils/csvParser');

art({})
  .then(() => console.log('Done'))
  .catch(err=> console.error(err))

data ({})
  .then(() => console.log('done'))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());

// seedData(100)
//   .then(() => console.log('done'))
//   .catch(err => console.error(err))
//   .finally(() => mongoose.connection.close());
