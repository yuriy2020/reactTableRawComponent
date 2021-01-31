const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');;
const cors=require('cors')

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000', 
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/'));
app.use('/getSettingsTable', require('./routes/'));
app.use('/postSettingsTable', require('./routes/'));
app.use('/columns',require('./routes/columns'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
