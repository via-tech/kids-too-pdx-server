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
      price: chance.integer({ min: 0, max: 900 }),
      ageMin: chance.integer({ min: 0, max: 9 }),
      ageMax: chance.integer({ min: 10, max: 18 }),
      description: 'It is a crazy event',
      category: chance.pickone(['sports', 'arts', 'volunteer']),
      likes: 100,
      pending: chance.pickone([true, false])
    })))
    .then(events => Promise.all([...Array(totalReferrals)].map(() => 
      Referral.create({
        user: chance.pickone(events).toJSON().user,
        eventName: chance.pickone(events).toJSON().name,
        date: chance.date()
      }))));
};
