var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var projectsRouter = require('./routes/projects');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mongoose.connect('mongodb+srv://dat:' + process.env.MONGO_ATLAS_PW + '@cluster0-mmyqj.mongodb.net/test?retryWrites=true',{
//     useNewUrlParser: true
// });
mongoose.connect('mongodb+srv://dat:datdeptrai123@cluster0-mmyqj.mongodb.net/realestate?retryWrites=true',{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) { // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
