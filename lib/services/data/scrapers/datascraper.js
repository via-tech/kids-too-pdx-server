const request = require('superagent');
const { parse } = require('node-html-parser');

module.exports = () => {
  return request.get('https://www.portlandoregon.gov/parks/38284')
    .then(res => res.text)
    .then(parse)
    .then(html => {
      return html.querySelectorAll('.bluetable td').map(td => td.text);

    });
};
