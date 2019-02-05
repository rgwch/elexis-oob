/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const serveIndex = require('serve-index')
const indexRouter = require('./routes/index');
const backupRouter = require('./routes/backup')
const dbRouter = require('./routes/db')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure valid routes
app.use('/', indexRouter);
app.use("/backup", backupRouter)
app.use("/db", dbRouter)
app.use('/elexis-core', serveIndex('public/core-repository'))
app.use('/elexis-base', serveIndex('public/base-repository'))
app.use('/elexis-ungrad', serveIndex('public/ungrad-repository'))

// all other routes: forward 404 to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
