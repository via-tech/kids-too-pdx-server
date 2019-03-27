require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../../lib/utils/connect');
const Event = require('../../lib/models/Event');

describe('Event model', () => {
  beforeAll(() => connect());

  beforeEach(() => mongoose.connection.dropDatabase());

  afterAll(done => mongoose.connection.close(done));

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
      likes: 100
    })
      .then(event => expect(event.toJSON()).toEqual({
        _id: expect.any(Object),
        __v: expect.any(Number),
        user: 'kidstoopdx@email.com',
        name: 'KidsToo PDX',
        image: 'https://paintncreate.com/wp-content/uploads/2018/03/Emoji-Week.png',
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
        pending: true
      }));
  });
});
