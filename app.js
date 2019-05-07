const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
var sessions = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

const url='mongodb+srv://tuan:tuan123@cluster0-mmyqj.mongodb.net/realestate?retryWrites=true'

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['authorization']
};
app.use(cors(corsOption));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const newsRouter = require('./routes/news');
const commentRouter = require('./routes/comment');

const adminRouter = require('./routes/admin/admin');
const manageAccountRouter = require('./routes/admin/manageAccount');
const manageProjectRouter = require('./routes/admin/manageProject');
const manageNewsRouter = require('./routes/admin/manageNews');

app.use(sessions({
  secret: '(!)*#(!JE)WJEqw09ej12',
  resave: false,
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors()); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(url,{
  useNewUrlParser: true
},function(err){
  if (err) 
    throw err
  else{
    console.log('Connect Data Successful')
  }
});
mongoose.Promise = global.Promise;

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/news', newsRouter);
app.use('/comment', commentRouter);

app.use('/admin', adminRouter);
app.use('/manageAccount', manageAccountRouter);
app.use('/manageProject', manageProjectRouter);
app.use('/manageNews', manageNewsRouter);

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
