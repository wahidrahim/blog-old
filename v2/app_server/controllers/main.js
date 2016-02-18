var mailer = require('nodemailer');

var index = function(req, res) {
  res.render('index');
}

var contact = function(req, res) {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wrsmtp@gmail.com',
      pass: 'df887HAf'
    }
  });

  var sig = '---\nname: ' + req.body.name + '\nemail: ' + req.body.email;

  transporter.sendMail({
    to: 'wahidrahim@gmail.com',
    subject: 'mail via wahidrahim.com',
    text: req.body.message + sig
  }, function(err, inf) {
    res.send(err);
  });
}

module.exports.index = index;
module.exports.contact = contact;
