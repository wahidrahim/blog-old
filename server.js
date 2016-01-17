var express = require('express');
var logger = require('morgan');
var path = require('path');
var sass = require('node-sass-middleware');

var server = express();

server.set('port', process.env.PORT || 1337);
server.set('view engine', 'jade');

server.use(sass({
  src: path.join(__dirname, 'public', 'styles', 'scss'),
  dest: path.join(__dirname, 'public', 'styles'),
  prefix: '/styles'
}));
server.use(logger('dev'));
server.use(express.static(path.join(__dirname, 'public')));

server.get('/', function(req, res) {
  res.render('index');
});

server.listen(server.get('port'), function() {
  console.log('Listening on ' + server.get('port'));
});
