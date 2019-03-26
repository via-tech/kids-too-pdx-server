const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const Event = require('../models/Event');

function data() {
  const input = fs.readFileSync('./lib/services/Summer2019.csv', { encoding:'utf8' });
  const records = parse(input, {
    columns: true, 
    skip_empty_lines: true
  });

  return Promise.all(records.map(event => {
    return Event.create({
      name: event.Name,
      date: event.Date,
      location: event.Venue,
      price: event.Price,
      ageMin: event.ageMin,
      ageMax: event.ageMax,
      description: event.Description,
      category: event.Categories,
    });
  }));
}
module.exports = data;

