const { parse } = require('url');

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

module.exports = { eventsFilters };
