let assert = require('assert');
let Deck = require('../../app/models/Deck.js');

describe('Deck', function() {
  
  let deck = null;

  describe('[constructor]', function() {
    it('should create 40 cards', function() {

      deck = new Deck();
      assert.equal(deck.cards.length, 40);
    });
  });

  describe('#shuffleCards', function() {
    it('should leave deck with the same previous ammount of cards', function() {
      deck.shuffleCards();
      assert.equal(deck.cards.length, 40);
    });
  });

  describe('#getHand', function() {
    it('should leave deck with minus 10 cards for each call', function() {

      deck.getHand();
      assert.equal(deck.cards.length, 30);
      deck.getHand();
      assert.equal(deck.cards.length, 20);
      deck.getHand();
      assert.equal(deck.cards.length, 10);
      deck.getHand();
      assert.equal(deck.cards.length, 0);
    });
  });
});


