const request = require('superagent');
const { parse } = require('node-html-parser');

module.exports = () => {
  return request.get('https://multcolib.org/events/storytimes')
    .then(res => res.text)
    .then(parse)
    .then(library);
};

const library = html => {
  const dateTime = html.querySelectorAll('.date-display-single').map(el=>el.text);
  const title = html.querySelectorAll('.view-upcoming-events-by-term-id .views-field-title a').map(el => el.text);
  const events = [];
  const venueRgx = html.querySelectorAll('.view-upcoming-events-by-term-id .views-field-event-location-translated a').map(el => el.text);
  for(let i = 0; i < venueRgx.length; i ++) {
    const day = dateTime[0].split(',')[1].trim();

    events.push({
      user: '1234',
      name: title[i],
      location: venueRgx[i],
      date: day,
      category: 'Educational',
      pending: false,
      website: 'https://multcolib.org/events'
    });
  }
  
  return events;
};
