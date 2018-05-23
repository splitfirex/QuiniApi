var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userModule = require('./users');
var groupModule = require('./groups');
var teamModule = require('./teams');
var leadModule = require('./leaderboard');

var secitury = require('./security').passport;
var dbconn = require('./dbconn');
var fixtures = require('./fixtures');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'keyboard cat',
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
  res.render('error');
});

module.exports = app;
