const User = require('../../models/User');

const user = {
  role: 'org',
  username: 'theTestOrg',
  password: 'pass',
  name: 'The Test Org',
  email: 'thetestorg@email.com',
  phone: '5551234568',
  address: {
    street: '124 Other Main St.',
    city: 'Portland',
    zipcode: '97203'
  }
};

module.exports = () => User.create(user);
