let assert = require('assert');
let Hand = require('../../app/models/Hand.js');
let Card = require('../../app/models/Card.js');

describe('Hand', function() {

  describe('[constructor]', function() {
    it('should put param on cards property', function() {
      let param = [];
      assert.equal(new Hand(param).cards, param); 
    });
  });

  describe('#removeCard', function() {

    let card1 = new Card('2', '♠');
    let card2 = new Card('3', '♠');
    let hand = new Hand([card1, card2]);

    it('should return true if the card was succefully removed', function() {
      assert.equal(hand.removeCard(card1), true);
    });

    it('removed cards cant be found in the hand', function() {
      assert.equal(hand.cards.findIndex(e => e.rank == card1.rank && e.suit == card1.suit), -1);
    });
    
    it('cards that were not removed should still be on the hand', function() {
      assert.notEqual(hand.cards.findIndex(e => e.rank == card2.rank && e.suit == card2.suit), -1);
    });

    it('if one card was removed the hand should have n - 1 cards', function() {
      assert.equal(hand.cards.length, 1);
    });

    it('should return false if the card was not removed', function() {
      assert.equal(hand.removeCard(card1), false);
    });

  });

  describe('#getLastcard', function() {
    it('should return the last card of the hand', function() {
      let card1 = new Card('2', '♠');
      let card2 = new Card('3', '♠');
      let hand = new Hand([card1, card2]);
      assert.equal(hand.getLastCard(), card2);
    });
  });

});


