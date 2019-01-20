var express = require('express');
var router = express.Router();

const ip=require('ip').address()

var net = require('net');

function getNetworkIP(callback) {
  var socket = net.createConnection(80, 'www.google.com');
  socket.on('connect', function() {
    callback(undefined, socket.address().address);
    socket.end();
  });
  socket.on('error', function(e) {
    callback(e, 'error');
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.render('index', { title: 'Elexis Out-Of-The-Box',
                         ip: ip });
});

module.exports = router;
