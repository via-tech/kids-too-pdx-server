require('../dataHelper');
const mongoose = require('mongoose');
const Referral = require('../../lib/models/Referral');

describe('Referral model', () => {
  it('creates a referral', () => {
    return Referral.create({
      user: 'kidstoopdx@email.com',
      eventName: 'KidsToo PDX',
      date: Date.now()
    })
      .then(referral => expect(referral.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        __v: expect.any(Number),
        user: 'kidstoopdx@email.com',
        eventName: 'KidsToo PDX',
        date: expect.any(Date)
      }));
  });
});
