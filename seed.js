/* eslint-disable no-console */
require('dotenv').config();
require('./lib/utils/connect')(process.env.MONGODB_URI_TEST);
const mongoose = require('mongoose');
const dataSA = require('./lib/utils/parsers/csvParser');
const art = require('./lib/utils/parsers/artsParser');
const library = require('./lib/services/data/scrapers/libraryScraper');
const pdxparent = require('./lib/services/data/parsed/pdxParent');
const { getParksAndRec } = require('./lib/services/data/parsed/parksAndRec');
const { getNonProfit } = require('./lib/services/data/parsed/nonProfit');

Promise.all([
  art(), 
  dataSA(),
  pdxparent(),
  library(),
  getParksAndRec(),
  getNonProfit()
])
  .then(()=> console.log('done'))
  .catch(err => console.error(err))
  .finally(() => mongoose.connection.close());
