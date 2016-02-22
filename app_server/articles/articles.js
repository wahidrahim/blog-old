var ARTICLES_DIR = '_articles';

var path = require('path');
var fs = require('fs');
var fm = require('front-matter');

var articles = [];

// Load articles on startup

fs.readdirSync(ARTICLES_DIR).forEach(function(file) {
  var article = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf8');

  article = format(article);

  // throw errors if required front-matter data is not available
  if (article.title === undefined)
    throw new Error('Article must have a title front-matter data. FILE' + file);
  if (isNaN(new Date(article.date).valueOf()))
    throw new Error('Article must have a valid date front-matter data. FILE: ' + file);

  if (article.publish === true)
    articles.push(article);
});

articles.sort(function(a, b) {
  return new Date(b.date) - new Date(a.date);
});

function format(article) {
  var fma = fm(article); // article with front-matter data
  var fmt = {}; // blank object to turn into formatted article

  fmt.title = fma.attributes.title;
  fmt.date = fma.attributes.date;
  fmt.url = fma.attributes.url;
  fmt.tags = fma.attributes.tags;
  fmt.publish = fma.attributes.publish;
  fmt.body = fma.body;

  if (fmt.url === undefined)
    fmt.url = fmt.title.split(' ').join('-').toLowerCase();

  return fmt;
}

module.exports = articles;
