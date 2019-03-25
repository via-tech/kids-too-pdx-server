const eventScraper = require('./lib/services/saturdayAcademy');

eventScraper()
  .then(events => {
    console.log(events, 'events');
  });

