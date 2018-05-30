var express = require('express');
var router = express.Router();
var local = require('./');
var leadModule = require('leaderboard');
var validateUser = require('security').validateUser;
var userModule = require('users');

/* GET users listing. */
/*router.get('/', function (req, res, next) {
  local.service.getPublicMatches(req.query.leadername, req.query.username)
    .then((matches) => res.status(200).json(matches.map(function (x) { return x.matches; }).reduce(function (a, b) { return { ...a, ...b } })))
    .catch((err) => res.status(400).json(err));
});
*/
router.get('/', function (req, res, next) {
  local.service.getLoggedMatches(req.query.leadername, req.query.username, !req.user ? null : req.user.username)
    .then((matches) => res.status(200).json(matches.map(function (x) { return x.matches; }).reduce(function (a, b) { return { ...a, ...b } })))
    .catch((err) => res.status(400).json(err));
});


router.post('/updatematch', function (req, res, next) {
  if (req.user.username == userModule.genericuser) {
    local.service.updateMatchMain(
      req.body.leadername,
      req.user.username, {
        home_result: parseInt(req.body.home_result),
        away_result: parseInt(req.body.away_result),
        home_penalty: parseInt(req.body.home_penalty),
        away_penalty: parseInt(req.body.away_penalty),
        home_team: parseInt(req.body.home_team),
        away_team: parseInt(req.body.away_team),
        match: req.body.match
      })
      .then((group) => res.status(200).json(group))
      .catch((err) => res.status(400).json(err));
  } else {
    local.service.updateMatch(
      req.body.leadername,
      req.user.username, {
        home_result: parseInt(req.body.home_result),
        away_result: parseInt(req.body.away_result),
        home_penalty: parseInt(req.body.home_penalty),
        away_penalty: parseInt(req.body.away_penalty),
        home_team: parseInt(req.body.home_team),
        away_team: parseInt(req.body.away_team),
        match: req.body.match
      })
      .then((group) => res.status(200).json(group))
      .catch((err) => res.status(400).json(err));
  }
});




router.get('/prueba', function (req, res, next) {
  local.service.lockEdit().then((fff) => res.status(200).json(fff)).catch((err) => res.status(500).json(err));
});

router.get('/prueba2', function (req, res, next) {
  leadModule.service.leaveleader("leader1", "Daniel")
    .then((fff) => res.status(200).json(fff)).catch((err) => res.status(500).json(err));
});






module.exports = router;