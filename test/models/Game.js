let assert = require('chai').assert;
let expect = require('chai').expect;
let Game = require('../../app/models/Game.js');
let Player = require('../../app/models/Player.js');

//TODO: How to suppress log messages during tests?

describe('Game', function() {

  describe('[constructor]', function() {

    it('should create constructor properties properly', function() {
      let game = new Game();
      assert.equal('players' in game, true);
      assert.equal('deck' in game, true);
      assert.equal('currentPlayerTurn' in game, true);
      assert.equal('trick' in game, true);
      assert.equal('packOfCards' in game, true);
      assert.equal('trumpSuit' in game, true);
    });

  });

  describe('#addPlayer', function() {
    let game = new Game();
    game.addPlayer('John');
    game.addPlayer('Felipe');
    
    it('should increment players length', function() {
      assert.notEqual(game.players.length, 0);
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
      assert.equal(game.players[1].team, 1);
    });

    it('should throw error when more than 4 players are added', function() {
      
      expect(function() {
        game.addPlayer('Sara');
        game.addPlayer('Raphael');
        game.addPlayer('Nath');
        
      }).to.throw();

    });
    
  });

  describe('#start', function() {
    
    let game = new Game();
    game.addPlayer('John');
    game.addPlayer('Felipe');
    game.addPlayer('Sara');
    game.addPlayer('Raphael');
    let trumpCard = game.start();

    it('each player should have 10 cards', function() {
      assert.equal(game.players[0].hand.cards.length, 10);
      assert.equal(game.players[1].hand.cards.length, 10);
      assert.equal(game.players[2].hand.cards.length, 10);
      assert.equal(game.players[3].hand.cards.length, 10);
    });

    it('trump suit should be the suit of the last card from the deck', function() {
      assert.equal(game.players[3].hand.cards[9].suit, game.trumpSuit);
    });

    it('returned card must be the last of the deck', function() {
      assert.equal(game.players[3].hand.cards[9], trumpCard);
    });

  });

});
