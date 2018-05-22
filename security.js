var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var userModule = require("./users");
var sha1 = require('sha1');

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(function (id, done) {
    userModule.service.findById(id)
        .then((user) => { (!user ? done(null, false, { message: 'user dont exists' }) : done(null, user)) })
        .catch((err) => { return done(err, null) });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'passwd'
},
    function (username, password, done) {
        userModule.service.findByUsername(username)
            .then((user) => {
                if (user === null) return done(null, false, { message: 'Incorrect username.' });
                if (!comparePasswords(user.password, password)) return done(null, false, { message: 'Incorrect password.' });
                return done(null, { username: user.username, _id: user._id});
            })
            .catch((err) => done(err, null) );
    }
));

function comparePasswords(userpassword, inputpassword) {
    return sha1(inputpassword) === userpassword
}

module.exports = passport;