var express = require('express');
var router = express.Router();
var local = require('./');
var validateUser = require('../security').validateUser;

router.get('/', function (req, res, next) {

  local.service.getAllLeaders()
    .then((leaders) => {
      return res.status(200).json(leaders.map(function (x) {
        if (req.user && Object.keys(x.listaUsers).indexOf(req.user.username) != -1) {
          return { ...x.toJSON(), playerCount: Object.keys(x.listaUsers).length, isPassword: x.password != undefined, password: null };
        }
        return hideLadderInfoMap(x)
      }))
    })
    .catch(err => res.status(400).send(err));
});

router.get('/detail', function (req, res, next) {
  local.service.getLoggedLeader(req.query.leadername, !req.user ? null : req.user.username)
    .then((leader) => !leader ? res.status(404).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(500).send(err));
});

router.post('/', function (req, res, next) {
  local.service.getAllLeaders()
    .then((leaders) => {
      return res.status(200).json(leaders.map(function (x) {
        if (Object.keys(x.listaUsers).indexOf(req.user.username) != -1) {
          return { ...x.toJSON(), playerCount: Object.keys(x.listaUsers).length, isPassword: x.password != undefined, password: null };
        }
        return hideLadderInfoMap(x)
      }))
    })
    .catch(err => res.status(400).send(err));
});

router.post('/updatecolor', function (req, res, next) {
  local.service.updateColor(req.query.leadername, req.user.username)
    .then((leader) => res.status(200).json(leader))
    .catch(err => res.status(400).send(err));
});

router.post('/join', function (req, res, next) {
  local.service.joinLeader(req.body.leadername, req.body.password, req.user.username)
    .then((leader) => res.status(200).json(leader))
    .catch(err => res.status(400).send(err));
});


router.post('/create', function (req, res, next) {
  local.service.createLeader({
    name: req.body.leadername, type: req.body.type, password: req.body.password,
    bgColor: Math.floor((Math.random() * 256 * 256 * 256)).toString(16)
  }, req.user.username)
    .then((leader) => res.status(200).json(leader))
    .catch(err => res.status(400).send(err));
});

router.post("/leave", function (req, res, next) {
  local.service.leaveleader(req.body.leadername, req.user.username)
    .then((leader) => { res.status(200).json(leader) })
    .catch(err => res.status(400).send(err));
});

router.post("/kick", function (req, res, next) {
  local.service.kickplayer(req.body.leadername, req.body.username, req.user.username)
    .then((leader) => { res.status(200).json(leader) })
    .catch(err => res.status(400).send(err));
});

router.post('/updatestatus', function (req, res, next) {
  local.service.updatePlayerStatus(req.user.username, req.body.leadername, { username: req.body.username, isAdmin: (req.body.isAdmin + '').toLowerCase() === 'true', isActive: (req.body.isActive + '').toLowerCase() === 'true' })
    .then((leader) => res.status(200).json(leader.listaUsers[req.body.username]))
    .catch(err => res.status(400).send(err));
});

function hideLadderInfoMap(x) {
  return { _id: x._id, bgColor: x.bgColor, type: x.type, name: x.name, isPassword: x.password != undefined, playerCount: Object.keys(x.listaUsers).length }
}

module.exports = router;