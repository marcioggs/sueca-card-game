const assert = require('chai').assert;
const io = require('socket.io-client');
const server = require('../../app/server.js');

describe.only('GameSetController', function() {

    //TODO: Export PORT to env variable.
    const PORT = 3000;
    const serverAddress = 'http://localhost:' + PORT;

    let player1socket;
    let player2socket;
    let player3socket;
    let player4socket;

    beforeEach(function(done) {
        player1socket = null;
        player2socket = null;
        player3socket = null;
        player4socket = null;
        
        server.listen(PORT, done);
    });

    afterEach(function(done) {
        if (player1socket !== null) { player1socket.disconnect(true); player1socket = null; };
        if (player2socket !== null) { player2socket.disconnect(true); player2socket = null; };
        if (player3socket !== null) { player3socket.disconnect(true); player3socket = null; };
        if (player4socket !== null) { player4socket.disconnect(true); player4socket = null; };
        
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
    });
});
