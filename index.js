const request = require('request-promise');
const cheerio = require('cheerio');
const { URL } = require('url');

const DOMAIN = 'https://www.twitter.com';

const requestUrl = (uri, opt = {}) => {
  const options = Object.assign({}, opt, {
    uri,
    transform(body, response) {
      if (response.headers['content-type'].includes('application/json')) {
        return JSON.parse(body);
      } else if (response.headers['content-type'].includes('text/html')) {
        return cheerio.load(body);
      } else {
        return body;
      }
    }
  });

  return request(options)
}

const getLinkStylesheets = function ($, baseUrl) {
  return $('link[rel="stylesheet"]')
    .map((i, el) => $(el).attr('href'))
    .toArray()
    .map(url => new URL(url, baseUrl))
}

const getStylesheets = function (urls) {
  return Promise.all(urls.map(url => requestUrl(url)))
} 

requestUrl(DOMAIN)
  .then($ => getLinkStylesheets($, DOMAIN))
  .then(getStylesheets)
  .then(console.log)

