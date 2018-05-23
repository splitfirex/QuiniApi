var express = require('express');
var router = express.Router();
var passport = require('../security').passport;
var validateUser = require('../security').validateUser;
var local = require('./');

router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (error, user, info) {
        if (error) return next(error);
        if (!user) return res.send({ success: false, message: info.message });
        req.logIn(user, function (err) {
            if (error) return next(error);
            user.password = null;
            return res.send({ success: true, message: "Login successful.", user: user });
        });
    })(req, res, next);
});

router.post('/register', function (req, res, next) {
    let data = Object.assign({},
        req.body.username && { username: req.body.username},
        req.body.password && { password: req.body.password}
      );
    local.service.registerUser(data)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json(err));
});

module.exports = router;