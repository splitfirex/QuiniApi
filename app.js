require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var userModule = require('users');
var groupModule = require('groups');
var teamModule = require('teams');
var leadModule = require('leaderboard');

var secitury = require('security').passport;
var dbconn = require('./dbconn');
require('./fixtures');


var app = express();

//app.user(bodyParser.json());
// after the code that uses bodyParser and other cool stuff
var originsWhitelist = [
  'http://localhost:3000',
  'http://localhost:3001',      //this is my front-end url for development
   'http://quini.gallego.ml',
   'http://rest.gallego.ml'
];
var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('express-session')({
  secret: process.env.sessionsecret,
  resave: true,
  saveUninitialized: true,
  cookie:{_expires : 600000}
}));

app.use(secitury.initialize());
app.use(secitury.session());

app.use('/api/user',userModule.api);
app.use('/api/group',groupModule.api);
app.use('/api/team',teamModule.api);
app.use('/api/leader',leadModule.api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('This is not the page you are looking for...');
});

module.exports = app;
