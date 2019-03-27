const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const Event = require('../../models/Event');

function data() {
  const input = fs.readFileSync('./lib/services/data/csv/artsCsvParser.csv', { encoding:'utf8' });
  const records = parse(input, {
    columns: true, 
    skip_empty_lines: true
  });

  return Promise.all(records.map(event => {
    return Event.create({
      name: event.Name,
      date: event.Date,
      ageMin: event.ageMin,
      ageMax: event.ageMax,
      time: event.Time,
      cost: event.Fee,
      description: (event.description),
      image: './public/assets/kidsart.jpg',
      pending: false
    });
  }));
}

module.exports = data;
