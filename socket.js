  /*let io = require('socket.io')(server);

io.on('connection', function (socket) {

    let count = 0;

    const User = require('./models/Player.js');
    
    let user = new User("Joao");
    console.log(user.name);
  
    if (count >= 4) {
      return;
    }
  
    count++;
    socket.emit('playerConnected', {nome: count});
    console.log('New player: ' + count);
  
    if (count == 4) {
      socket.emit('startHand', { hello: 'world' });
      console.log('Hand started');
    }
  
    socket.on('disconnect', function () {
      count--;
      console.log('Player have left. Count:' + count);
    });
  });*/
  
  /* Eventos:
    conectou (x4)
      start hand
        start trick (x10)
          jogar carta (x4)
        finish trick
      finish hand
  
  */

//export default (server) => {
let count = 0;

module.exports = class Socket {
    constructor(server) {
        let io = require('socket.io')(server);

        io.on('connection', function (socket) {
        
            /*const User = require('./models/Player.js');
            
            let user = new User("Joao");
            console.log(user.name);*/
          
            if (count >= 4) {
              return;
            }
          
            count++;
            socket.emit('playerConnected', {nome: count});
            console.log('New player: ' + count);
          
            if (count == 4) {
              socket.emit('startHand', { hello: 'world' });
              console.log('Hand started');
            }
          
            socket.on('disconnect', function () {
              count--;
              console.log('Player have left. Count:' + count);
            });
          });
    }

}