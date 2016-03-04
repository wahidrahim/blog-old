var express = require('express');
var mailer = require('nodemailer');

var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Wahid Rahim',
    page: 'main'
  });
});

router.post('/contact', function(req, res) {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wrsmtp@gmail.com',
      pass: 'df887HAf'
    }
  });

  var sig = '\n---\nname: ' + req.body.name + '\nemail: ' + req.body.email;

  transporter.sendMail({
    to: 'wahidrahim@gmail.com',
    subject: 'mail from \'' + req.body.name + '\' via wahidrahim.com',
    text: req.body.message + sig
  }, function(err, inf) {
    res.send(err);
  });
});

module.exports = router;
