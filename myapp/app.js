const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');

const adminRouter = require('./routes/admin/admin');
const manageAccountRouter = require('./routes/admin/manageAccount');
const manageProjectRouter = require('./routes/admin/manageProject');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors()); 
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

app.use('/admin', adminRouter);
app.use('/manageAccount', manageAccountRouter);
app.use('/manageProject', manageProjectRouter);

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
