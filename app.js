var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var nodemailer = require('nodemailer');
var transporter = require('./config/nodemailer')(nodemailer);
var session = require('express-session');
var flash = require('express-flash');

var app = express();

app.use(session({ 
    secret: 'grandhack15',
    resave: false,
    saveUninitialized: false
}));

// Get configuration params, use for db and passport
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
//error handling
mongoose.connection.on('error', function(err){
    console.log(err);
});
//reconnect when closed?
mongoose.connection.on('disconnected',function(){
    mongoose.connect(configDB.url);
});


// Views setup: ejs template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//TODO database, config params

// Passport setup TODO
require('./config/passport')(passport,transporter);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); //for flash messages stored in session


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/models',express.static(__dirname+'/models'));
var eventmodel = require('./models/event.js').model;
var usermodel = require('./models/user.js');

app.engine('.html', require('ejs').renderFile);
app.use('voice.html',express.static(__dirname+'/voice.html'));
app.use('/voice',express.static(__dirname+'/voice'));


// Scheduler
var schedule = require('node-schedule');
var dialogueFn;

// Routes
require('./routes.js')(app, usermodel, schedule, dialogueFn);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
