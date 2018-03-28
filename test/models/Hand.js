let assert = require('chai').assert;
let Hand = require('../../app/models/Hand.js');
let Card = require('../../app/models/Card.js');

describe('Hand', function() {

  let hand = null;
  const card1 = new Card('2', '♠');
  const card2 = new Card('3', '♠');

  beforeEach(function() {
    hand = new Hand([card1, card2]);
  });

  describe('[constructor]', function() {
    it('should put param on cards property', function() {
      let param = [];
      assert.equal(new Hand(param).cards, param); 
    });
  });

  describe('#removeCard', function() {

    it('should return true if the card was removed', function() {
      assert.isTrue(hand.removeCard(card1));
    });

    it('should return false if the card wasnt removed', function() {
      assert.isFalse(hand.removeCard(new Card('4', '♠')));
    });

    it('removed cards cannot be found in the hand', function() {
      hand.removeCard(card1);
      assert.notDeepInclude(hand.cards, card1);
    });
    
    it('cards that were not removed should still be on the hand', function() {
      hand.removeCard(card1);
      assert.deepInclude(hand.cards, card2);
    });
    
    it('if one card was removed the hand should have n - 1 cards', function() {
      hand.removeCard(card1);
      assert.lengthOf(hand.cards, 1);
    });

  });

  describe('#getLastcard', function() {
    it('should return the last card in the hand', function() {
      assert.equal(hand.getLastCard(), card2);
    });
  });

  describe('#hasCardOfSuit', function() {
    it('should return true if have card of the informed suit', function() {
      assert.isTrue(hand.hasCardOfSuit('♠'));
    });

    it('should return false if doesnt have card of the informed suit', function() {
      assert.isFalse(hand.hasCardOfSuit('♣'));
    });
  });

});


