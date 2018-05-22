var express = require('express');
var router = express.Router();
var passport = require('passport');

function validateUser(req, res, next) {
    if (req.user === undefined) {
        res.status(401);
        res.end("Bad user");
    } else {
        next();
    }
}

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

router.post('/session', [validateUser], function (req, res, next) {
    res.status(200);
    res.json({ success: true, message: "Login successful." });
}
);

module.exports = router;