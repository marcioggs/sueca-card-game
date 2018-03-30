let assert = require('chai').assert;
let Player = require('../../app/models/Player.js');

describe('Player', function() {

  let players = null;

  before(function() {
     players = [
      new Player(0, 'Marcio', 0),
      new Player(1, 'Gabriel', 1),
      new Player(2, 'Gomes', 0),
      new Player(3, 'Silva', 1)
    ];
  });

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
    it('should return a player with the id informed if its found in players list', function() {
      assert.equal(Player.getPlayer(players, 1).name, 'Gabriel');
    });

    it('should return null if there isnt a player with the id informed in the players list', function() {
      assert.isUndefined(Player.getPlayer(players, 4));
    });
  });

  describe('#getPlayerIndex', function() {
    it('should return the player index if a player with the id informed is found on the players list', function() {
      assert.equal(Player.getPlayerIndex(players, 2), 2);
    });

    it('should return -1 if a player with the id informed is not found on the players list', function() {
      assert.equal(Player.getPlayerIndex(players, 4), -1);
    });
  });

});
