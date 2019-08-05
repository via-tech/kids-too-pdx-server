require('dotenv').config();
const express = require('express');
const app = express();

const { handler } = require('./middleware/error');

app.use(express.json());
app.use(require('./middleware/cors'));

app.use('/auth', require('./routes/auth'));
app.use('/events', require('./routes/events'));
app.use('/orgs', require('./routes/orgs'));
app.use('/activate', require('./routes/activate'));
app.use('*', (req, res) => res.redirect(process.env.HOME_URL));

app.use(handler);

module.exports = app;
