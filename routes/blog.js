var express = require('express');
var moment = require('moment');
var marked = require('marked');

var router = express.Router();

var articles = require('../blog/articles');

router.get('/', function(req, res, next) {
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

  if (article) {
    res.render('blog', {
      title: article.title,
      date: moment(new Date(article.date)).format('MMM Do, YYYY'),
      body: marked(article.body)
    });
  }
  else {
    var error = new Error('Article not found');
    error.status = 404;

    res.status(error.status);
    res.render('error', {
      message: error.message,
      error: {status: error.status}
    })
  }
});

function getArticleByUrl(url) {
  for (var i = 0; i < articles.length; i++) {
    if (url === articles[i].url)
      return articles[i];
  }
}

module.exports = router;
