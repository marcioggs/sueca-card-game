const assert = require('chai').assert;
const io = require('socket.io-client');

describe.only('GameSetController', function() {

    //TODO: Export PORT to env variable.
    const PORT = 3000;
    const serverAddress = 'http://localhost:' + PORT;

    let server;

    let players = [
        {socket: null, name: 'Marcio'},
        {socket: null, name: 'Gabriel'},
        {socket: null, name: 'Gomes'},
        {socket: null, name: 'Silva'},
    ];

    let disconnectSocket = function(socket) {
        if (socket !== null) {
            socket.disconnect(true);
        };   
    }
    
    let check = function(done, func) {
        try {
            func();
            done();
        } catch (e) {
            done(e);
        }
    }
    
    let initPlayersSockets = function(quantity) {
        for (let i = 0; i < quantity; i++) {
            players[i].socket = io(serverAddress);
        }
    }

    let setPlayerNames = function(quantity) {
        for (let i = 0; i < quantity; i++) {
            players[i].socket.emit('setName', players[i].name);
        }
    }

    beforeEach(function(done) {
        //Force reload of module and create a new GameSetController instance.
        delete require.cache[require.resolve('../../app/server.js')];
        server = require('../../app/server.js');

        server.listen(PORT, done);
    });
    
    afterEach(function(done) {
        players.forEach(player => {
            disconnectSocket(player.socket);
            player.socket = null;
        });

        server.close(done);
     });

    describe.only('setName', function() {
        it('player that set name should receive the player variable filled', function(done) {
            let numberOfPlayers = 1;
            initPlayersSockets(numberOfPlayers);
            
            players[0].socket.on('nameSet', function(player) {
                assert.equal(player.name, players[0].name);
                assert.property(player, 'name');
                assert.property(player, 'team');
                done();
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
        it('all players should receive the new player', function(done) {
            let numberOfPlayers = 2;
            initPlayersSockets(numberOfPlayers);
            
            players[1].socket.on('playerListChanged', function(p) {
                assert.equal(p[0].name, players[0].name);
                done();
            });
            
            players[0].socket.emit('setName', players[0].name);
        });

        it('should send cards to players when there are four players are in the room', function(done) {
            let numberOfPlayers = 4;
            initPlayersSockets(numberOfPlayers);
            
            players[0].socket.on('gameStarted', function(data) {
                assert.lengthOf(data.hand.cards, 10);
                assert.property(data.trumpCard, 'rank');
                assert.property(data.trumpCard, 'suit');
                done();
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
        it('should announce that the game started when there are four players are in the room', function(done) {
            let numberOfPlayers = 4;
            initPlayersSockets(numberOfPlayers);
            
            players[0].socket.on('trickStarted', function() {
                done();
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
        it('should announce that the game started when there are four players are in the room', function(done) {
            let numberOfPlayers = 4;
            initPlayersSockets(numberOfPlayers);
            
            players[0].socket.on('trickStarted', function() {
                done();
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
        it('first player that entered the room should be the first to play', function(done) {
            let numberOfPlayers = 4;
            initPlayersSockets(numberOfPlayers);
            
            players[0].socket.on('playCard', function() {
                done();
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
        it('other players than the first one should know that is first players turn', function(done) {
            let numberOfPlayers = 4;
            initPlayersSockets(numberOfPlayers);
            
            players[1].socket.on('playerTurn', function(playerId) {
                check(done, function () {
                    assert.equal(playerId, 0);
                });
            });
            
            setPlayerNames(numberOfPlayers);
        });
        
    });
});

