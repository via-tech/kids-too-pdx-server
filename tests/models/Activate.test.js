require('../dataHelper');
const Activate = require('../../lib/models/Activate');

describe('Activate model', () => {
  it('creates an activation', () => {
    return Activate.create({
      user: 'kids@email.com',
      code: '123abc' 
    })
      .then(activate => expect(activate.toJSON()).toEqual({
        _id: expect.any(Object),
        user: 'kids@email.com',
        code: '123abc'
      }));
  });
});
