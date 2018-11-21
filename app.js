var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var dbRouter = require('./routes/model/db_api');
var userRouter = require('./routes/model/user_api');
var tripRouter = require('./routes/model/trip_api');
var stepRouter = require('./routes/model/step_api');
var poiRouter = require('./routes/model/poi_api');
var wpRouter = require('./routes/model/wp_api');

var app = express();

// Some logs info...
const startedDate = new Date();
console.log("");
console.log("__dirname =>", __dirname);
console.log(">> Started at: " + startedDate);
console.log("");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/db', dbRouter);
app.use('/user', userRouter);
app.use('/trip', tripRouter);
app.use('/step', stepRouter);
app.use('/poi', poiRouter);
app.use('/wp', wpRouter);

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
