var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== CONNECT MONGODB ATLAS =====
mongoose.connect(
  'mongodb+srv://bbbnhan1_db_user:MGkv23eYE5L9VCKZ@cluster0.6ml8uee.mongodb.net/NNPTUD-S2?retryWrites=true&w=majority'
);

mongoose.connection.on('connected', function () {
  console.log("da connect MongoDB Atlas");
});

mongoose.connection.on('error', function (err) {
  console.error("MongoDB connection error:", err);
});
// =================================

// routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message
  });
});

module.exports = app;
