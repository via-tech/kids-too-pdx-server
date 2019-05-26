require('dotenv').config();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

beforeAll(() => connect(process.env.MONGODB_URI_TEST));

afterAll(done => {
  mongoose.connection.dropDatabase()
    .then(() => mongoose.connection.close(done));
});
