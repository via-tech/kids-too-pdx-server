const eventScraper = require('./lib/services/datascraper');

eventScraper()
  .then(events => {
    console.log(events, 'events');
  });

