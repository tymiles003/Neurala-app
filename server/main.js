const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')

var index = require('./routes/index');

var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

app.use(session({ 
  secret: 'sessionsecret', 
  resave: true, 
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var models = require("./models");

require('./config/passport.js')(passport, models.users);

models.sequelize.sync().then(function() {
  console.log('Nice! Database looks fine');
}).catch(function(err) {
  console.log(err, "Something went wrong with the Database Update!")
});

app.use('/', index)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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