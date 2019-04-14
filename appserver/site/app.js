/****************************************
 * This file is part of elexis-oob      *
 * Copyright (c) 2019 by G. Weirich     *
 ****************************************/

const createError = require('http-errors');
const https = require('https')
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const busboy = require('connect-busboy')
const session = require('express-session')
const memstore = require('memorystore')(session)
const app = express();
const winston = require('winston')
const crypto = require('crypto')
winston.level = "debug"
winston.add(new winston.transports.Console())
winston.info("Appserver running in mode "+process.env.NODE_ENV)
const serveIndex = require('serve-index')
const indexRouter = require('./routes/index');
const backupRouter = require('./routes/backup')
const manageRouter = require('./routes/manage')
const dbRouter = require('./routes/db')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: crypto.randomBytes(16).toString(),
  resave: false,
  saveUninitialized: false,
  store: new memstore({
    checkPeriod: 1800000
  })
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy({
  highWaterMark: 10 * 1024 * 1024, // Set 10 MiB buffer
}));


// static routes to repositories
app.use('/elexis-core', serveIndex('public/core-repository'))
app.use('/elexis-base', serveIndex('public/base-repository'))
app.use('/elexis-ungrad', serveIndex('public/ungrad-repository'))

// static route to resumable script
app.get('/resumable.js', function (req, res) {
  var fs = require('fs');
  res.setHeader("content-type", "application/javascript");
  fs.createReadStream("./utils/resumable.js").pipe(res);
});

// configure valid routes
app.use('/', indexRouter);
app.use("/backup", backupRouter)
app.use("/db", dbRouter)
app.use("/manage", manageRouter)

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
