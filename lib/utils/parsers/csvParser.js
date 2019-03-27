const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const Event = require('../../models/Event');

function dataSA() {
  const input = fs.readFileSync('./lib/services/data/csv/Summer2019.csv', { encoding:'utf8' });
  const records = parse(input, {
    columns: true, 
    skip_empty_lines: true
  });

  return Promise.all(records.map(event => {
    if(event.Categories.includes('Art')) {
      event.image = 'http://www.hotchkisslibrary.org/wp-content/uploads/2017/01/Kids-Art-1.jpg';
    } if(event.Categories === 'Performance') {
      event.image = 'https://www.theatermania.com/dyn/photos/theatermania/v1finw2400x0y0w1200h743/kenneth-cabral-center-with-rosies-theater-kids-at-the-2017-133399.jpg';
    } else if(event.Categories === 'Educational') {
      event.image = 'https://lighthousementoring.co.uk/wp-content/uploads/2017/08/educational-mentoring-cornwall.jpeg';
    }
    return Event.create({
      name: event.Name,
      date: event.Date,
      location: event.Venue,
      price: event.Price,
      ageMin: event.ageMin,
      ageMax: event.ageMax,
      description: event.Description,
      category: event.Categories,
      image: event.image,
      pending: false
    });
  }));
}
module.exports = dataSA;

