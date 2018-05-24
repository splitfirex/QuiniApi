var express = require('express');
var router = express.Router();
var local = require('./');
var validateUser = require('../security').validateUser;

router.get('/', function (req, res, next) {
  local.service.getAllLeaders()
    .then((leaders) =>
      res.status(200).json(leaders.map(hideLadderInfoMap))
    )
    .catch(err =>
      res.status(500).send(err));
});

router.get('/detail', function (req, res, next) {
  local.service.getPublicLeader(req.query.leadername)
    .then((leader) => !leader ? res.status(404).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(500).send(err));
});

router.post('/', validateUser, function (req, res, next) {
  local.service.getAllLeaders()
    .then((leaders) => {
      return res.status(200).json(leaders.map(function (x) {
        if (x.listaUsers.map(function (x1) { return x1.username }).indexOf(req.user.username) != -1) {
          return { ...x.toJSON(), playerCount: x.listaUsers.length, isPassword: !x.password, password: null };
        }
        return { _id: x._id, name: x.name, isPassword: !x.password, playerCount: x.listaUsers.length }
      }))
    }
    )
    .catch(err =>
      res.status(400).send(err));
});

router.post('/detail', validateUser, function (req, res, next) {
  local.service.getLoggedLeader(req.body.leadername, req.user.username)
    .then((leader) => !leader ? res.status(400).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(400).send(err));
});

router.post('/join', validateUser, function (req, res, next) {
  local.service.joinLeader(req.body.leadername, req.body.password, req.user.username)
    .then((leader) => !leader ? res.status(400).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(400).send(err));
});


router.post('/create', validateUser, function (req, res, next) {
  local.service.createLeader({
    name: req.body.leadername, type: req.body.type, password: req.body.password,
    listaUsers: [{ username: req.user.username, isAdmin: true, isActive: true }]
  })
    .then((leader) => !leader ? res.status(400).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(400).send(err));
});

router.post('/updatestatus', validateUser, function (req, res, next) {
  local.service.updatePlayerStatus(req.user.username, req.body.leadername, { username: req.body.username, isAdmin: (req.body.isAdmin + '').toLowerCase() === 'true', isActive: (req.body.isActive + '').toLowerCase() === 'true' })
    .then((leader) => !leader ? res.status(400).json({}) :
      res.status(200).json(leader.listaUsers.filter(function(x){ return x.username === req.body.username })))
    .catch(err =>
      res.status(400).send(err));
});

function hideLadderInfoMap(x) {
  return { _id: x._id, name: x.name, isPassword: !x.password, playerCount: x.listaUsers.length }
}

module.exports = router;