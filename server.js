var express = require('express');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');

var server = express();

server.set('port', process.env.PORT || 1337);
server.set('view engine', 'jade');

server.use(logger('dev'));
server.use(bodyParser.urlencoded({extended: false}));
server.use(stylus.middleware(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', function(req, res) {
  res.render('index', {
    skills: {
      js: 80,
      html: 100,
      css: 90,
      cpp :70,
      c: 65,
      ruby: 68
    }
  });
});

server.post('/contact', function(req, res, next) {
  // eberything goot?
  // send mail?
  console.log(req.body);
  res.redirect('back');
  //res.render('contacted');
  //or notify in the same page/place
});

server.listen(server.get('port'), function() {
  console.log('Listening on ' + server.get('port'));
});
