const request = require('superagent');
const { parse } = require('node-html-parser');
const Event = require('../../../models/Event');

module.exports = () => {
  return request.get('https://events.time.ly/khatqvw?categories=13734,13729,13726,13735,13728,13739,13721,13736,13722,13724,13731,13737,13730,13723,13727&id=timely_1014534094')
    .then(res => res.text)
    .then(parse)
    .then(findEvents);
};
let events = [];

const findEvents = async(html) => {
  let title = html.querySelectorAll('.timely-title-text').map(el => el.text);
  let dateRgx = html.querySelectorAll('.timely-start-time').map(el => el.text);
  let venueRgx = html.querySelectorAll('.timely-venue').map(el => el.text);
  let descriptionRgx = html.querySelectorAll('.timely-description').map(el => el.text);
  
  for(let i = 0; i < venueRgx.length; i++) {
    const dateTime = dateRgx[i].replace(/\n\t+/g, '');
    const date1 = dateTime.split('@')[0];
    const time1 = dateTime.split('@')[1];
    const locationVenue = venueRgx[i].replace(/\n\t+/g, '');
    const info = descriptionRgx[i].replace(/\n\t+/g, '');
    const info2 = info.replace(/\n+/g, '');

    await Event.create({
      user: '1234',
      name: title[i],
      date: date1,
      time: time1,
      location: {
        venue: locationVenue
      },
      description: info2,
      pending: false,
      liability: true
    }); 
  }
  
  return events;
};
