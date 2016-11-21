var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv').config({path: 'process.env'});




var pg = require('pg');
var conString = "postgres://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.APP_DB_HOST+":"+process.env.APP_DB_PORT+"/"+process.env.APP_DB_NAME;
console.log(conString);
var client = new pg.Client(conString);
// connect to our database
client.connect(function (err) {
    if (err) throw err;

    // execute a query on our database
    client.query('SELECT * FROM users', function (err, result) {
        if (err) throw err;

        // just print the result to the console
        console.log(result.rows[0]); // outputs: { name: 'brianc' }

        // disconnect the client
        client.end(function (err) {
            if (err) throw err;
        });
    });
});



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
