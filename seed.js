require('dotenv').config();
require('./lib/utils/connect')();
const mongoose = require('mongoose');
const dataSA = require('./lib/utils/csvParser');
const art = require('./lib/utils/artsParser');
const library = require('./lib/services/libraryScraper');
const pdxparent = require('./lib/services/pdxParent');
const { getParksAndRec } = require('./lib/services/parksAndRec');
const { getNonProfit } = require('./lib/services/nonProfit');

Promise.all([
  art(), 
  dataSA(),
  pdxparent(),
  library(),
  getParksAndRec(),
  getNonProfit()
])
  .then(()=>console.log('done'))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());
  