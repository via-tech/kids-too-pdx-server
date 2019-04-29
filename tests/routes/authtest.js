const request = require('supertest');
const app = require('../../lib/app');

describe('auth routes', () => {
  let user = null;

  beforeAll(done => {
    return request(app)
      .post('/auth')
      .send({
        username: 'theOrg123',
        email: 'theorg@email.com',
        password: 'passittothewordyo',
        name: 'The Org'
      })
      .then(res => {
        user = res.body;
        done();
      }); 
  });

  it('creates a user for organiztion', () => {
    return request(app)
      .delete(`/auth/${user.user_id}`)
      .then(res => expect(res.body).toEqual({ deleted: 1 }));
  });
});
