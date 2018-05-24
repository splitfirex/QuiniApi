var express = require('express');
var router = express.Router();
var local = require('./');

/* GET users listing. */
router.get('/', function (req, res, next) {
  local.service.getPublicMatches(req.query.leadername, req.query.username)
    .then((matches) => res.status(200).json(matches))
    .catch((err) => res.status(400).json({}));
});

router.get('/prueba', function (req, res, next) {
  local.service.createDefaulsGroupsPlayer(req.query.leadername, req.query.username)
    .then((matches) => res.status(200).json(matches))
    .catch((err) => res.status(400).json({}));
});



module.exports = router;