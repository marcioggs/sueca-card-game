var app = require('express')();
var server = require('http').Server(app);
var GameSetController = require('./web/GameSetController.js');

server.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

new GameSetController(server);
