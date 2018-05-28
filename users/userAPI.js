var express = require('express');
var router = express.Router();
var passport = require('../security').passport;
var validateUser = require('../security').validateUser;
var local = require('./');


router.post("/sesion", function (req, res, next) {
    if (req.user) res.status(200).send({ success: true, user: req.user });
    res.status(400).send({ success: false });
});

router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (error, user, info) {
        if (error) return next(error);
        if (!user) return res.status(400).send({ success: false, message: info.message });
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.status(200).send({ success: true, message: "Login successful.", user: user });
        });
    })(req, res, next);
});

router.post("/logout", function (req, res, next) {
    req.logout();
    return res.status(200).send();
});

router.post('/register', function (req, res, next) {
    let data = Object.assign({},
        req.body.username && { username: req.body.username },
        req.body.password && { password: req.body.password }
    );
    local.service.registerUser(data)
        .then((user) => 
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.status(200).send({ success: true, message: "Login successful.", user: user });
        }))
        .catch((err) => res.status(400).json(err));
});

module.exports = router;