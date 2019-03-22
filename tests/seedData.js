const chance = require('chance').Chance();
const Event = require('../lib/models/Event');

module.exports = (totalEvents = 20) => {
  return Promise.all([...Array(totalEvents)].map(() => Event.create({
    user: '1234',
    name: chance.name(),
    date: chance.date(),
    location: {
      city: 'Portland',
      zip: 97223
    },
    time: '4pm',
    price: 25,
    age: 12,
    description: 'It is a crazy event',
    pending: true,
    category: 'sports',
    likes: 100
  })));
};
