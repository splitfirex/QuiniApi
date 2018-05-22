var express = require('express');
var router = express.Router();
var local = require('./');

/* GET users listing. */
router.get('/', function (req, res, next) {
  local.service.getAllLeaders()
    .then((leaders) =>
      res.status(200).json(leaders))
    .catch(err =>
      res.status(500).send(err));
});

module.exports = router;