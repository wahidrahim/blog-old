var express = require('express');
var moment = require('moment');
var marked = require('marked');

var articles = require('../articles/articles');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('blog', {
    articles: articles.map(function(article) {
      return {
        title: article.title,
        date: moment(new Date(article.date)).format('MMM Do, YYYY'),
        tags: article.tags,
        url: article.url
      }
    })
  });
});

router.get('/article/:url', function(req, res) {
  var article = getArticleByUrl(req.params.url);

  res.render('article', {
    title: article.title,
    date: moment(new Date(article.date)).format('MMM Do, YYYY'),
    body: marked(article.body)
  });
});

function getArticleByUrl(url) {
  for (var i = 0; i < articles.length; i++) {
    if (url === articles[i].url)
      return articles[i];
  }
}

module.exports = router;
