let express = require('express');
let app = express();
let server = require('http').Server(app);
let Socket = require('./socket.js');

server.listen(80);

app.use('/web', express.static('web'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/web/index.html');
});

let s = new Socket(server);
//sockets.init(server);
