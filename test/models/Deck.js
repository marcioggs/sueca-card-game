let assert = require('chai').assert;
let expect = require('chai').expect;
let Deck = require('../../app/models/Deck.js');

describe('Deck', function() {
  
  let deck = null;

  beforeEach(function() {
    deck = new Deck();
  });

  describe('[constructor]', function() {
    it('should create 40 cards', function() {
      assert.lengthOf(new Deck().cards, 40);
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

    it('should throw an error if there is no more cards in the deck', function() {
      deck.getHand();
      deck.getHand();
      deck.getHand();
      deck.getHand();

      expect(function() {
        deck.getHand();
      }).to.throw('Deck doesnt have 10 cards.');
    });
  });
});


