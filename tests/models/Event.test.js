require('../dataHelper');
const Event = require('../../lib/models/Event');

describe('Event model', () => {
  it('creates an event', () => {
    return Event.create({
      user: 'kidstoopdx@email.com',
      name: 'KidsToo PDX',
      date: Date.now(),
      location: {
        name: 'Tualatin Rec Center',
        city: 'Tualatin',
        zip: 97062
      },
      time: '5pm',
      price: 25,
      ageMin: 3,
      ageMax: 5,
      category: 'sports',
      likes: 100,
      contact: {
        name: 'Me'
      },
      reducedRate: true,
      liability: true
    })
      .then(event => expect(event.toJSON()).toEqual({
        _id: expect.any(Object),
        user: 'kidstoopdx@email.com',
        name: 'KidsToo PDX',
        image: 'https://www.kids-partycabin.com/images/601xNxkids-party-ideas.jpg.pagespeed.ic.BcdgHRTk4x.jpg',
        date: expect.any(Date),
        location: {
          name: 'Tualatin Rec Center',
          city: 'Tualatin',
          zip: 97062
        },
        time: '5pm',
        price: 25,
        ageMin: 3,
        ageMax: 5,
        category: 'sports',
        likes: 100,
        contact: {
          name: 'Me'
        },
        reducedRate: true,
        liability: true
      }));
  });
});
