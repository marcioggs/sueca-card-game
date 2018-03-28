let assert = require('chai').assert;
let expect = require('chai').expect;
let Trick = require('../../app/models/Trick.js');
let GameSet = require('../../app/models/GameSet.js');
let Player = require('../../app/models/Player.js');
let Card = require('../../app/models/Card.js');
let Hand = require('../../app/models/Hand.js');

describe('Trick', function() {

  let trick = null;
  let players = null;

  beforeEach(function() {

    let player0 = new Player(0, 'Marcio', 0);
    player0.hand = new Hand([new Card('7', '♠'), new Card('7', '♥'), new Card('5', '♣'), new Card('A', '♣')]);
    let player1 = new Player(1, 'Gabriel', 1);
    player1.hand = new Hand([new Card('4', '♠'), new Card('3', '♥'), new Card('7', '♣'), new Card('J', '♣')]);
    let player2 = new Player(2, 'Gomes', 0);
    player2.hand = new Hand([new Card('5', '♠'), new Card('4', '♥'), new Card('Q', '♣'), new Card('2', '♦')]);
    let player3 = new Player(3, 'Silva', 1);
    player3.hand = new Hand([new Card('5', '♥'), new Card('6', '♥'), new Card('J', '♣'), new Card('Q', '♣')]);

    players = [player0, player1, player2, player3];

    trick = new Trick(players, '♥', 2)
  });

  describe('#getNextPlayer', function() {
    it('should return player id received in constructor if its the first play', function() {
      assert.equal(trick.getNextPlayer(), 2);
    });

    it('should return null if the trick has already ended', function() {
      trick.playCard(2, new Card('5', '♠'));
      trick.playCard(3, new Card('5', '♥'));
      trick.playCard(0, new Card('7', '♠'));
      trick.playCard(1, new Card('4', '♠'));

      assert.isNull(trick.getNextPlayer());
    });
  });

  describe('#playCard', function() {
    
    it('should throw exception if playerId infomed doesnt exists on players list', function() {
      expect(function() {
        trick.playCard(4, new Card('2', '♠'));
      }).to.throw('Player with id 4 doesnt exists'); 
    });

    it('should throw if a player plays not in his turn', function() {
      expect(function() {
        trick.playCard(3, new Card('5', '♥'));
      }).to.throw('Its not players 3 turn, its 2'); 
    });

    it('should throw if a player has card of the choosen suit and does not play it', function() {
      trick.playCard(2, new Card('5', '♠'));
      trick.playCard(3, new Card('5', '♥'));
      expect(function() {
        trick.playCard(0, new Card('7', '♥'));
      }).to.throw('Player must play a card of suit: ♠');
    });

    it('should throw if the player doesnt have the played card', function() {
      expect(function() {
        trick.playCard(2, new Card('A', '♥'));
      }).to.throw('Player 2 doesnt have card [A, ♥]');
    });

    it('should remove a card if the player has already played it', function() {
      trick.playCard(2, new Card('5', '♠'));
      assert.notDeepInclude(players[2].hand.cards, new Card('5', '♠'));
    });

    it('should push player and cards to the trick deck', function() {
      trick.playCard(2, new Card('5', '♠'));
      assert.deepInclude(trick.cardsPlayed, new Card('5', '♠'));
      assert.deepInclude(trick.playersPlayed, trick.players[2]);
    });

    it('should change players turn', function() {
      trick.playCard(2, new Card('5', '♠'));
      assert.equal(trick.getNextPlayer(), 3);
      trick.playCard(3, new Card('5', '♥'));
      assert.equal(trick.getNextPlayer(), 0);
      trick.playCard(0, new Card('7', '♠'));
      assert.equal(trick.getNextPlayer(), 1);
      trick.playCard(1, new Card('4', '♠'));
      assert.isNull(trick.getNextPlayer());
    });
  });

  describe('#finish', function() {

    it('should throw if the trick hasnt ended yet', function() {
      trick.playCard(2, new Card('5', '♠'));
      trick.playCard(3, new Card('5', '♥'));
      trick.playCard(0, new Card('7', '♠'));
      
      expect(function() {
        trick.finish();
      }).to.throw('This trick still has 1 cards to be played.');
    });

    it('win by rank if nobody plays a trump card', function() {
      trick.playCard(2, new Card('Q', '♣'));
      trick.playCard(3, new Card('J', '♣'));
      trick.playCard(0, new Card('5', '♣'));
      trick.playCard(1, new Card('7', '♣'));
      trick.finish();

      assert.equal(trick.playerThatWon.team, 1);
      assert.equal(trick.playerThatWon.id, 1);
    });

    it('other suit card doesnt count', function() {
      trick.playCard(2, new Card('2', '♦'));
      trick.playCard(3, new Card('Q', '♣'));
      trick.playCard(0, new Card('A', '♣'));
      trick.playCard(1, new Card('J', '♣'));
      trick.finish();

      assert.equal(trick.playerThatWon.team, 0);
      assert.equal(trick.playerThatWon.id, 2);
    });
    
    it('win by trump if there is a trump card', function() {
      trick.playCard(2, new Card('5', '♠'));
      trick.playCard(3, new Card('5', '♥'));
      trick.playCard(0, new Card('7', '♠'));
      trick.playCard(1, new Card('4', '♠'));
      trick.finish();
  
      assert.equal(trick.playerThatWon.team, 1);
      assert.equal(trick.playerThatWon.id, 3);
    });
  });

});


