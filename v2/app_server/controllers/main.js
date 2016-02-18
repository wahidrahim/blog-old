var index = function(req, res) {
  res.render('index');
}

var contact = function(req, res) {
  // TODO send mail
  console.log(req.body);
}

module.exports.index = index;
module.exports.contact = contact;
