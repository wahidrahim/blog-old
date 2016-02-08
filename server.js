//////////////////
// DEPENDENCIES //
//////////////////
var express = require('express');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var mailer = require('nodemailer');

var server = express();

///////////////////
// CONFIGURATION //
///////////////////
server.set('port', process.env.PORT || 1337);
server.set('view engine', 'jade');

/////////////////
// MIDDLEWARES //
/////////////////
server.use(logger('dev'));
server.use(bodyParser.urlencoded({extended: false}));
server.use(stylus.middleware(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', function(req, res) {
  res.render('index', {
    // TODO refactor so skills is not being sent from here
    skills: {
      js: 80,
      html: 100,
      css: 90,
      cpp :70,
      c: 65,
      ruby: 68,
      java: 70,
      csharp: 50
    }
  });
});

server.post('/contact', function(req, res) {
  console.log(req.body);

  transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wrsmtp@gmail.com',
      pass: 'df887HAf'
    }
  });

  transporter.sendMail({
    to: 'wahidrahim@gmail.com',
    subject: '[CONTACT from '+req.body.name+' : '+req.body.email+']',
    text: req.body.message
  }, function(err, inf) {
    if (err)
      res.send(false);
    else
      res.send(true);
  });
});

server.listen(server.get('port'), function() {
  console.log('Listening on ' + server.get('port'));
});
