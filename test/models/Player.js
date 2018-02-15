let assert = require('chai').assert;
let Player = require('../../app/models/Player.js');

describe('Player', function() {

  describe('[constructor]', function() {
    let player = new Player(1, 'John', 2);

    it('first param should be stored on id property', function() {
      assert.equal(player.id, 1); 
    });

    it('second param should be stored on name property', function() {
      assert.equal(player.name, 'John'); 
    });

    it('third param should be stored on team property', function() {
      assert.equal(player.team, 2); 
    });

  });

  describe('#getPlayer', function() {

    let players = [
      new Player(0, 'Player 0', 0),
      new Player(1, 'Player 1', 1),
      new Player(2, 'Player 2', 0),
      new Player(3, 'Player 3', 1)
    ];

    it('should return a player with the id informed if its found in players list', function() {
      let player = Player.getPlayer(players, 3);
      assert.equal(player.name, 'Player 3');
    });

    it('should return null if there isnt a player with the id informed in the players list', function() {
      let player = Player.getPlayer(players, 4);
      assert.isNull(player);
    });

  });

  describe('#getPlayerIndex', function() {

    let players = [
      new Player(4, 'Player 4', 0),
      new Player(5, 'Player 5', 1),
      new Player(6, 'Player 6', 0),
      new Player(7, 'Player 7', 1)
    ];

    it('should return the player index if a player with the id informed is found on the players list', function() {
      let playerIndex = Player.getPlayerIndex(players, 7);
      assert.equal(playerIndex, 3);
    });

    it('should return -1 if a player with the id informed is not found on the players list', function() {
      let playerIndex = Player.getPlayerIndex(players, 8);
      assert.equal(playerIndex, -1);
    });

  });

});


