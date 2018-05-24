var express = require('express');
var router = express.Router();
var local = require('./');
var leadModule = require('leaderboard');

/* GET users listing. */
router.get('/', function (req, res, next) {
  local.service.getPublicMatches(req.query.leadername, req.query.username)
    .then((matches) => res.status(200).json(matches))
    .catch((err) => res.status(400).json({}));
});

router.get('/prueba', function (req, res, next) {
  leadModule.service.joinLeader("leader1","123456","Daniel2")
  .then((fff)=> res.status(200).json(fff)).catch((err)=>  res.status(500).json(err) );


});

router.get('/prueba2', function (req, res, next) {
  leadModule.service.updatePlayerStatus("Daniel","leader1",{isActive: false, isAdmin: true, username: "Daniel" })
  .then((fff)=> res.status(200).json(fff)).catch((err)=>  res.status(500).json(err) );
});






module.exports = router;