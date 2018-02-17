let assert = require('chai').assert;
let expect = require('chai').expect;
let Game = require('../../app/models/Game.js');
let Card = require('../../app/models/Card.js');
let Hand = require('../../app/models/Hand.js');
let Player = require('../../app/models/Player.js');

//TODO: How to suppress log messages during tests?
//TODO: Make all tests independent without repeating a lot of setup code.

describe('Game', function() {

  describe('[constructor]', function() {

    it('should create constructor properties properly', function() {
      let game = new Game();
      assert.property(game, 'players');
      assert.property(game, 'deck');
      assert.property(game, 'currentPlayerTurn');
      assert.property(game, 'trick');
      assert.property(game, 'packOfCards');
      assert.property(game, 'trumpSuit');
    });

  });

  describe('#addPlayer', function() {
    let game = new Game();
    game.addPlayer('John');
    game.addPlayer('Felipe');
    
    it('should have added players to players array', function() {
      assert.isNotEmpty(game.players);
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
        
      }).to.throw('Only 4 players are allowed.');

    });
    
  });

  describe('#start', function() {
    
    let game = new Game();
    game.addPlayer('John');
    game.addPlayer('Felipe');
    game.addPlayer('Sara');
    game.addPlayer('Raphael');

    it('should not let start the game with more or less than 4 players', function() {
      expect(function() {
        game.addPlayer('Thais');
        game.start();
      }).to.throw('Only 4 players are allowed.');      
    });

    delete game.players.splice(4, 1);
    let trumpCard = game.start();

    it('each player should have 10 cards', function() {
      assert.lengthOf(game.players[0].hand.cards, 10);
      assert.lengthOf(game.players[1].hand.cards, 10);
      assert.lengthOf(game.players[2].hand.cards, 10);
      assert.lengthOf(game.players[3].hand.cards, 10);
    });

    it('trump suit should be the suit of the last card from the deck', function() {
      assert.equal(game.players[3].hand.cards[9].suit, game.trumpSuit);
    });

    it('returned card must be the last of the deck', function() {
      assert.equal(game.players[3].hand.cards[9], trumpCard);
    });
    
    it('first player to play should be the first one added', function() {
      assert.equal(game.currentPlayerTurn, 0);
    });

  });

  describe('#playCard', function() {

    let game = new Game();
    game.addPlayer('John');
    game.addPlayer('Felipe');
    game.addPlayer('Sara');
    game.addPlayer('Raphael');
    game.start();
    mock(game); //TODO: Find a lib to mock easily.

    it('should throw an error if it doesnt exists a player with the id informed', function() {
      expect(function() {
        game.playCard(5, new Card('5', '♠'));
      }).to.throw('Player with id 5 doesnt exists');  
    });

    it('should throw an error if its not the player informed turn', function() {
      expect(function() {
        game.playCard(2, new Card('5', '♠'));
      }).to.throw('Its not players 2 turn');  
    });

    it('first played card of the trick should be the suit of the trick', function() {
      game.playCard(0, new Card('2', '♠'));
      assert.equal(game.trick.suit, '♠');
    });

    it('players should play a card of the trick suit', function() {
      expect(function() {
        game.playCard(1, new Card('2', '♣'));
      }).to.throw('Player must play a card of suit: ♠'); 
    });

    it('player should have the played card on his hand', function() {
      expect(function() {
        game.playCard(1, new Card('A', '♠'));
      }).to.throw(/^Player .* doesnt have card .*$/);
    });

    it('played card should be added to the trick', function() {
      assert.deepEqual(game.trick.cards[0], new Card('2', '♠'));
    });

    it('owner of the played card should be added to the trick', function() {
      assert.deepEqual(game.trick.players[0], game.players[0]);
    });

    it('winning payer shoud receive the trick points', function() {
      game.playCard(1, new Card('3', '♠'));
      game.playCard(2, new Card('A', '♠'));
      game.playCard(3, new Card('7', '♠'));
      
      assert.lengthOf(game.packOfCards[0], 4);
    });

  });

});

function mock(game) {
  let cards = null;

  cards = [
    new Card('2', '♠'),
    new Card('2', '♥'),
    new Card('Q', '♥'),
    new Card('K', '♥'),
    new Card('4', '♣'),
    new Card('5', '♣'),
    new Card('6', '♣'),
    new Card('Q', '♣'),
    new Card('A', '♣'),
    new Card('2', '♦') ]; 

  game.players[0].hand = new Hand(cards);

  cards = [
    new Card('3', '♠'),
    new Card('6', '♠'),
    new Card('Q', '♠'),
    new Card('7', '♥'),
    new Card('2', '♣'),
    new Card('7', '♣'),
    new Card('4', '♦'),
    new Card('5', '♦'),
    new Card('6', '♦'),
    new Card('7', '♦') ]; 

  game.players[1].hand = new Hand(cards);

  cards = [
    new Card('5', '♠'),
    new Card('J', '♠'),
    new Card('K', '♠'),
    new Card('A', '♠'),
    new Card('3', '♥'),
    new Card('4', '♥'),
    new Card('6', '♥'),
    new Card('3', '♣'),
    new Card('3', '♦'),
    new Card('Q', '♦') ];

  game.players[2].hand = new Hand(cards);

  cards = [
    new Card('4', '♠'),
    new Card('7', '♠'),
    new Card('5', '♥'),
    new Card('J', '♥'),
    new Card('A', '♥'),
    new Card('J', '♣'),
    new Card('K', '♣'),
    new Card('J', '♦'),
    new Card('K', '♦'),
    new Card('A', '♦') ];

  game.players[3].hand = new Hand(cards);
  game.trumpSuit = '♥';
}
