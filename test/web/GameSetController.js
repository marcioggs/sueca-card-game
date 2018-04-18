const assert = require('chai').assert;
const io = require('socket.io-client');

describe.only('GameSetController', function() {

    //TODO: Export PORT to env variable.
    const PORT = 3000;
    const serverAddress = 'http://localhost:' + PORT;

    let server;

    let player1socket;
    let player2socket;
    let player3socket;
    let player4socket;

    beforeEach(function(done) {
        player1socket = null;
        player2socket = null;
        player3socket = null;
        player4socket = null;
        
        //Force reload of module and create a new GameSetController instance.
        delete require.cache[require.resolve('../../app/server.js')];
        server = require('../../app/server.js');

        server.listen(PORT, done);
    });
    
    afterEach(function(done) {
        disconnectSocket(player1socket);
        disconnectSocket(player2socket);
        disconnectSocket(player3socket);
        disconnectSocket(player4socket);

        server.close(done);
     });

    describe('setName', function() {
        it('player that set name should receive the player variable filled', function(done) {
            player1socket = io(serverAddress);
            
            player1socket.on('nameSet', function(player) {
                assert.equal(player.name, 'Marcio');
                assert.property(player, 'name');
                assert.property(player, 'team');
                done();
            });
            
            player1socket.emit('setName', 'Marcio');
        });

        it('all players should receive the new player', function(done) {
            player1socket = io(serverAddress);
            player2socket = io(serverAddress);

            player2socket.on('playerListChanged', function(players) {
                assert.equal(players[0].name, 'Marcio');
                done();
            });
            player1socket.emit('setName', 'Marcio');
        });

        it('should send cards to players when there are four players are in the room', function(done) {
            player1socket = io(serverAddress);
            player2socket = io(serverAddress);
            player3socket = io(serverAddress);
            player4socket = io(serverAddress);

            player1socket.on('gameStarted', function(data) {
                assert.lengthOf(data.hand.cards, 10);
                assert.property(data.trumpCard, 'rank');
                assert.property(data.trumpCard, 'suit');
                done();
            });

            player1socket.emit('setName', 'Marcio');
            player2socket.emit('setName', 'Gabriel');
            player3socket.emit('setName', 'Gomes');
            player4socket.emit('setName', 'Silva');
        });
        
    });
});

function disconnectSocket(socket) {
    if (socket !== null) {
        socket.disconnect(true);
    };   
}
