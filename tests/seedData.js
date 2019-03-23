const chance = require('chance').Chance();
const Event = require('../lib/models/Event');
const Referral = require('../lib/models/Referral');

module.exports = (totalEvents = 20, totalReferrals = 10) => {
  return Promise.all([...Array(totalEvents)].map(() => 
    Event.create({
      user: chance.email(),
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
      category: chance.pickone(['sports', 'arts', 'volunteer']),
      likes: 100
    })))
    .then(events => Promise.all([...Array(totalReferrals)].map(() => 
      Referral.create({
        user: chance.pickone(events).toJSON().user,
        eventName: chance.pickone(events).toJSON().name,
        date: chance.date()
      }))));
};
