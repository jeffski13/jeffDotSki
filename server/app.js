var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

//more db hookups
//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDBUrl = 'mongodb://localhost:27017/travelBlogs';
mongoose.connect(mongoDBUrl);
//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("jeffski: Connection made with '", mongoDBUrl, "'");
});
//allows us to autoIncrement id field for database entries
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'chronoheadshot.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//all the routers we are using
app.use('/', index);
app.use('/users', users);

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
