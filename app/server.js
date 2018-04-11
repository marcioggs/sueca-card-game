var app = require('express')();
var server = require('http').Server(app);
var GameSetController = require('./web/GameSetController.js');

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

new GameSetController(server);

module.exports = server;
