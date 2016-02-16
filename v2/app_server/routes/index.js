var express = require('express');
var controller = require('../controllers/main.js');
var router = express.Router();

/* GET home page. */
router.get('/', controller.index);

module.exports = router;
