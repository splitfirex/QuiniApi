var express = require('express');
var router = express.Router();
var local = require('./');

/* GET users listing. */
router.get('/user', function(req, res, next) {
  console.log(local.service.functionService("234"));
  res.json(local.service.functionService("234"));
});

module.exports = router;