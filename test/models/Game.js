let assert = require('chai').assert;
let expect = require('chai').expect;
let Game = require('../../app/models/Game.js');
let Card = require('../../app/models/Card.js');
let Hand = require('../../app/models/Hand.js');
let Player = require('../../app/models/Player.js');

//TODO: How to suppress log messages during tests?
describe('Game', function() {

  describe('[constructor]', function() {
    it('should not let start the game with more or less than 4 players', function() {
      let players = []

      players.push(new Player(0, 'Marcio', 0));
      expect(function() {
        new Game(players, 0);
      }).to.throw('There must be 4 players in the room.');

      players.push(new Player(1, 'Gabriel', 1));
      expect(function() {
        new Game(players, 0);
      }).to.throw('There must be 4 players in the room.');

      players.push(new Player(2, 'Gabriel', 0));
      expect(function() {
        new Game(players, 0);
      }).to.throw('There must be 4 players in the room.');
    });
  });

  //TODO: Remove
  /*       delete game.players.splice(4, 1);
        let trumpCard = game.start(); */

  describe('#start', function() {

    let game = null;

    before(function() {
      let players = [];
      players.push(new Player(0, 'Marcio', 0));
      players.push(new Player(1, 'Gabriel', 1));
      players.push(new Player(2, 'Gomes', 0));
      players.push(new Player(3, 'Silva', 1));

      game = new Game(players, 0);
      game.start();
    });
    
    it('each player should have 10 cards', function() {
      assert.lengthOf(game.players[0].hand.cards, 10);
      assert.lengthOf(game.players[1].hand.cards, 10);
      assert.lengthOf(game.players[2].hand.cards, 10);
      assert.lengthOf(game.players[3].hand.cards, 10);
    });

    it('trump card must be the last of the deck', function() {
      assert.deepEqual(game.players[3].hand.cards[9], game.trumpCard);
    });
  });

  describe('#startTrick', function() {

    let game = null;

    beforeEach(function() {
      game = mockGame();
    });

    it('should return null if the game already ended'); //TODO: Test.

    it('should throw if there is already a trick in progress', function() {
      game.startTrick();
      expect(function() {
        game.startTrick();
      }).to.throw('There is already a trick in progress.');
    });

    it('first player of the first trick should be the shuffled the cards', function() {
      assert.equal(game.startTrick().currentPlayerIdTurn, 0);
    });

    it('first player of the others trick should be the won last trick', function() {
      game.startingPlayerId = 3;
      assert.equal(game.startTrick().currentPlayerIdTurn, 3);
    });
  });

  describe('#finishTrick', function() {
    it('should throw if there isnt a trick in progress', function() {
      let game = mockGame();
      expect(function() {
        game.finishTrick();
      }).to.throw('There is no trick in progress.');
    });
  });

  describe('#_calculateEarnedPoints', function() {
    it ('should count points correctly', function() {
      let game = mockGame();
      game._cardsWonByTeam[0] = [new Card('J', '♠'), new Card('7', '♠'), new Card('2', '♥'), new Card('6', '♠')];
      game._cardsWonByTeam[1] = [new Card('A', '♥'), new Card('5', '♣'), new Card('7', '♣'), new Card('4', '♥')];
      game._calculateEarnedPoints();
      assert.equal(game.earnedPointsByTeam[0], 13);
      assert.equal(game.earnedPointsByTeam[1], 21);
    });
  });

  describe('#_calculateEarnedGameSetPoints', function() {
    let game = null;

    beforeEach(function() {
      game = mockGame();
    });

    it('team 0 should win if it has more points', function() { 
      game.earnedPointsByTeam[0] = 61;
      game.earnedPointsByTeam[1] = 59;
      game._calculateEarnedGameSetPoints();
      assert.equal(game.teamThatWon, 0);
    });

    it('team 1 should win if it has more points', function() { 
      game.earnedPointsByTeam[0] = 59;
      game.earnedPointsByTeam[1] = 61;
      game._calculateEarnedGameSetPoints();
      assert.equal(game.teamThatWon, 1);
    });
    
    it('should draw if teams has the same ammount of points', function() { 
      game.earnedPointsByTeam[0] = 60;
      game.earnedPointsByTeam[1] = 60;
      game._calculateEarnedGameSetPoints();
      assert.isTrue(game.tied);
    });

    it('should win 4 set points if a team wins with 120 game points', function() { 
      game.earnedPointsByTeam[0] = 120;
      game.earnedPointsByTeam[1] = 0;
      game._calculateEarnedGameSetPoints();
      assert.equal(game.earnedGameSetPoints, 4);
    });

    it('should win 2 set points if a team wins with more than 90 game points', function() { 
      game.earnedPointsByTeam[0] = 91;
      game.earnedPointsByTeam[1] = 0;
      game._calculateEarnedGameSetPoints();
      assert.equal(game.earnedGameSetPoints, 2);
    });

    it('should win 1 set point if a team wins with less than 90 game points', function() { 
      game.earnedPointsByTeam[0] = 61;
      game.earnedPointsByTeam[1] = 59;
      game._calculateEarnedGameSetPoints();
      assert.equal(game.earnedGameSetPoints, 1);
    });

  });

});

//TODO: Is there a lib that fits this well?
//TODO: Extract to another file to reuse on GameSet.js test
function mockGame() {

  let players = [];
  players.push(new Player(0, 'Marcio', 0));
  players.push(new Player(1, 'Gabriel', 1));
  players.push(new Player(2, 'Gomes', 0));
  players.push(new Player(3, 'Silva', 1));

  game = new Game(players, 0);
  game.start();

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
  game.trumpSuit = new Card('A', '♥');

  return game;
}
