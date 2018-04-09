const assert = require('chai').assert;
const io = require('socket.io-client');
const server = require('../../app/index.js');

describe.only('GameSetController', function() {

    //TODO: Export PORT to env variable.
    const serverAddress = 'http://localhost:3000';
    let player1socket = null;
    let player2socket = null;
    let player3socket = null;
    let player4socket = null;

    after(function(done) {
        if (player1socket !== null) { player1socket.disconnect(); };
        if (player2socket !== null) { player2socket.disconnect(); };
        if (player3socket !== null) { player3socket.disconnect(); };
        if (player4socket !== null) { player4socket.disconnect(); };

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
        
/*         it('all players should receive the new player', function(done) {
            player1socket = io(serverAddress);
            player2socket = io(serverAddress);

            player2socket.on('playerListChanged', function(players) {
                assert.equal(players[0].name, 'Marcio');
                done();
            });

            player1socket.emit('setName', 'Marcio');
        }); */
    });
});
