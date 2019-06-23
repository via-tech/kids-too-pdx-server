const { hash } = require('../utils/hash');
const { parse } = require('url');

const patcher = fieldsKey => (req, res, next) => {
  const { body } = req;
  const fields = {
    user: ['username', 'name', 'email', 'phone', 'address', 'password'],

    event: ['name', 'image', 'date', 'location', 'time', 'price', 'ageMin', 'ageMax', 'description', 'category', 'contact', 'reducedRate', 'website']
  };

  const patched = Object.keys(body).reduce((acc, key) => {
    if(fields[fieldsKey].includes(key) && body[key]) {
      acc[key] = body[key];
    }
    return acc;
  }, {});

  if(patched.password) {
    hash(patched.password)
      .then(hashedPassword => {
        patched.passwordHash = hashedPassword;
        req.body.patched = patched;
        next();
      });
  } else {
    req.body.patched = patched;
    next();
  }
};

const eventsFilters = (req, res, next) => {
  const { query } = parse(req.url, true);

  req.body.filtered = Object.keys(query).map(key => {
    const value = query[key];

    if(key === 'ageMin') return ({ ageMin: { $gte: parseInt(value) } });
    
    if(key === 'ageMax') return ({ ageMax: { $lte: parseInt(value) } });

    if(key === 'price') return ({ price: { $lte: parseInt(value) } });

    if(key === 'category') return ({ category: value });

    return {};
  });

  next();
};

module.exports = { patcher, eventsFilters };
