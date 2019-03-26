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
  const title = html.querySelectorAll('.views-field-title').map(el => el.text);
  console.log(dateTime);
  const events = [];
  
  const venueRgx = html.querySelectorAll('.field-content a').map(el => el.text);
  for(let i = 0; i < venueRgx.length; i += 2) {
    const title2 = title[i].replace(/\n\t+/g, '');
    // console.log(title2, 'titlei');
    const venue = venueRgx[i + 1];
    // console.log(venue);

    events.push({
      name: title2,
      location: venue,
      date: dateTime[0]
    });
  }
  console.log('events', events);
};
