let assert = require('chai').assert;
let Game = require('../../app/models/Game.js');
let Player = require('../../app/models/Player.js');

describe('Game', function() {

  let game = new Game();

  describe('[constructor]', function() {

    it('should create players property', function() {
      assert.equal('players' in game, true);
    });

    it('should create deck property', function() {
      assert.equal('deck' in game, true);
    });

    it('should create currentPlayerTurn property', function() {
      assert.equal('currentPlayerTurn' in game, true);
    });

    it('should create trick property', function() {
      assert.equal('trick' in game, true);
    });

    it('should create packOfCards property', function() {
      assert.equal('packOfCards' in game, true);
    });

    it('should create trumpSuit property', function() {
      assert.equal('trumpSuit' in game, true);
    });

  });

  describe('#addPlayer', function() {

    game.addPlayer('John');

    it('should increment players length', function() {
      assert.equal(game.players.length, 1);
    });
    
    it('should assign a player id', function() {
      assert.isNotNull(game.players[0]);
    });

    it('first parameter should be the added player name', function() {
      assert.equal(game.players[0].name, 'John');
    });

    it('first added player should be on team 0', function() {
      assert.equal(game.players[0].team, 0);
    });

    it('second added player should be on team 1', function() {
      game.addPlayer('Felipe');
      assert.equal(game.players[1].team, 1);
    });

    //TODO: Teste thrown error on 5th added player
/*     it('second added player should be on team 1', function() {
      game.addPlayer('Felipe');
      assert.equal(game.players[1].team, 1);
    }); */
    
  });

});
