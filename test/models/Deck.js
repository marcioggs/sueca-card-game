let assert = require('chai').assert;
let Deck = require('../../app/models/Deck.js');

describe('Deck', function() {
  
  let deck = null;

  describe('[constructor]', function() {
    it('should create 40 cards', function() {

      deck = new Deck();
      assert.lengthOf(deck.cards, 40);
    });
  });

  describe('#shuffleCards', function() {
    it('should leave deck with the same previous ammount of cards', function() {
      deck.shuffleCards();
      assert.lengthOf(deck.cards, 40);
    });
  });

  describe('#getHand', function() {
    it('should leave deck with minus 10 cards for each call', function() {

      deck.getHand();
      assert.lengthOf(deck.cards, 30);
      deck.getHand();
      assert.lengthOf(deck.cards, 20);
      deck.getHand();
      assert.lengthOf(deck.cards, 10);
      deck.getHand();
      assert.lengthOf(deck.cards, 0);
    });
  });
});


