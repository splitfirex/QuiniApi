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
    .then((leaders) =>{
      return res.status(200).json(leaders.map(function (x) {
        console.log(x.listaUsers.map(function(x1){ return x.isActive && x1.username}));
        if (x.listaUsers.map(function(x1){ return x.isActive && x1.username}).indexOf(req.user.username) != -1) {
          return {...x.toJSON(), playerCount: x.listaUsers.length, isPassword: !x.password, password: null };
        }
        return { _id: x._id, name: x.name, isPassword: !x.password, playerCount: x.listaUsers.length }
      }))
    }
    )
    .catch(err =>
      res.status(500).send(err));
});

router.post('/detail', validateUser, function (req, res, next) {
  local.service.getLoggedLeader(req.body.leadername,req.user.username)
    .then((leader) => !leader ? res.status(404).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(500).send(err));
});

router.post('/join', validateUser, function (req, res, next) {
  local.service.joinLeader(req.body.leadername,req.user.username)
    .then((leader) => !leader ? res.status(404).json({}) :
      res.status(200).json(leader))
    .catch(err =>
      res.status(500).send(err));
});


function hideLadderInfoMap(x) {
  return { _id: x._id, name: x.name, isPassword: !x.password, playerCount: x.listaUsers.length }
}

module.exports = router;