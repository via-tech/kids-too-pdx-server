const User = require('../../models/User');

const users = [
  {
    role: 'org',
    username: 'theTestOrg1',
    password: 'pass',
    name: 'The Test Org1',
    email: 'thetestorg@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    logo: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/11/shrug-796x398.png',
    bio: 'The bestest organization ever!!'
  },
  {
    role: 'org',
    username: 'theTestOrg2',
    password: 'pass',
    name: 'The Test Org2',
    email: 'thetestorg@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    logo: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/11/shrug-796x398.png',
    bio: 'The bestest organization ever!!'
  },
  {
    role: 'org',
    username: 'theTestOrg3',
    password: 'pass',
    name: 'The Test Org3',
    email: 'thetestorg@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    logo: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/11/shrug-796x398.png',
    bio: 'The bestest organization ever!!'
  },
  {
    role: 'org',
    username: 'theTestOrg4',
    password: 'pass',
    name: 'The Test Org4',
    email: 'thetestorg@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    logo: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/11/shrug-796x398.png',
    bio: 'The bestest organization ever!!'
  },
  {
    role: 'org',
    username: 'theTestOrg5',
    password: 'pass',
    name: 'The Test Org5',
    email: 'thetestorg@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    logo: 'https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2016/11/shrug-796x398.png',
    bio: 'The bestest organization ever!!'
  },
  {
    role: 'admin',
    username: 'theTestAdmin1',
    password: 'pass',
    name: 'The Test Admin1',
    email: 'thetestadmin@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    bio: 'The bestest admin ever!!'
  },
  {
    role: 'admin',
    username: 'theTestAdmin2',
    password: 'pass',
    name: 'The Test Admin2',
    email: 'thetestadmin@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    bio: 'The bestest admin ever!!'
  },
  {
    role: 'inactive',
    username: 'theInactive',
    password: 'pass',
    name: 'The Inactive',
    email: 'theinactive@email.com',
    phone: '5551234568',
    address: {
      street: '124 Other Main St.',
      city: 'Portland',
      zipcode: '97203'
    },
    bio: 'The bestest organization ever!!'
  }
];

module.exports = () => Promise.all(users.map(user => User.create(user)));
