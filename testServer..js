/* eslint-disable no-console */
require('dotenv').config();
require('./lib/utils/connect')(process.env.MONGODB_URI_TEST);

const app = require('./lib/app');

const PORT = process.env.PORT_TEST || 7892;

app.listen(PORT, () => {
  console.log(`RUNNING ON PORT ${PORT}`);
});
