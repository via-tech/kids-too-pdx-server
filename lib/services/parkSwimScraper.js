const request = require('superagent');
const { parse } = require('node-html-parser');

module.exports = () => {
  return request.get('https://www.portlandoregon.gov/parks/38284')
    .then(res => res.text)
    .then(parse)
    .then(findAddress);
};

const findAddress = html => {
  const tds = html.querySelectorAll('.bluetable td').map(td => td.text);
  // console.log('all',tds); 

  const events = [];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  for(let i = 8; i < tds.length; i += 8) {
    const venue = tds[i];
    // const day = tds[i - 7];
    const monday = tds[i + 1];
    // const tuesday = tds[i + 2];
    // const wednesday = tds[i + 3];
    // const thursday = tds[i + 4];
    // const friday = tds[i + 5];
    // const saturday = tds[i + 6];
    // const sunday = tds[i + 7];

    // const times = monday.split('p')[0];
    const swim = monday.split('p')[1].trim();
    console.log(swim);
  
    //monday
    events.push({
      name: 'Family Swim',
      date: days[0],
      location: {
        address1: venue.split('|')[0].trim(),
        address2: venue.split('|')[1].trim()
      },
      time: monday.split('Family')[0].trim(),
      category: 'sports',
      cost: 'prices vary'
    });
    events.push({
      name: 'Family Swim',
      date: days[1],
      location: {
        address1: venue.split('|')[0].trim(),
        address2: venue.split('|')[1].trim()
      },
      time: monday.split('Family')[0].trim(),
      category: 'sports',
      cost: 'prices vary'
    });
    events.push({
      name: 'Family Swim',
      date: days[2],
      location: {
        address1: venue.split('|')[0].trim(),
        address2: venue.split('|')[1].trim()
      },
      time: monday.split('Family')[0].trim(),
      category: 'sports',
      cost: 'prices vary'
    });
  


  }
  // console.log(events, 'events');
};
