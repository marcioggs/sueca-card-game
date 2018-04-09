//TODO: Change all require variables do cont type.
let assert = require('chai').assert;
let Card = require('../../app/models/Card.js'); //TODO: All these ../ are creepy. See ttps://gist.github.com/branneman/8048520

describe('Card', function() {
  describe('[constructor]', function() {

    it('2-6 cards should have 0 points', function() {
      assert.equal(new Card('2', '♠').point, 0);
      assert.equal(new Card('3', '♠').point, 0);
      assert.equal(new Card('4', '♠').point, 0);
      assert.equal(new Card('5', '♠').point, 0);
      assert.equal(new Card('6', '♠').point, 0);
    });

    it('Q cards should have 2 points', function() {
      assert.equal(new Card('Q', '♠').point, 2);
    });

    it('J cards should have 3 points', function() {
      assert.equal(new Card('J', '♠').point, 3);
    });

    it('K cards should have 4 points', function() {
      assert.equal(new Card('K', '♠').point, 4);
    });

    it('7 cards should have 10 points', function() {
      assert.equal(new Card('7', '♠').point, 10);
    });

    it('A cards should have 11 points', function() {
      assert.equal(new Card('A', '♠').point, 11);
    });
    
  });

  describe('#allRanks', function() {
    it('should return all ranks', function() {
      const ranks = Card.allRanks();

      assert.include(ranks, '2');
      assert.include(ranks, '3');
      assert.include(ranks, '4');
      assert.include(ranks, '5');
      assert.include(ranks, '6');
      assert.include(ranks, 'Q');
      assert.include(ranks, 'J');
      assert.include(ranks, 'K');
      assert.include(ranks, '7');
      assert.include(ranks, 'A');

      assert.lengthOf(ranks, 10);
    })
  });

  describe('#allSuits', function() {
    it('should return all suits', function() {
      const suits = Card.allSuits();

      assert.include(suits, '♠');
      assert.include(suits, '♥');
      assert.include(suits, '♦');
      assert.include(suits, '♣');

      assert.lengthOf(suits, 4);
    })
  });

  describe('#toString', function() {
    it('should return the format [rank, suit]', function() {
      assert.equal(new Card('A', '♠').toString(), '[A, ♠]');
    });
  });

  describe('#getRankIndex', function() {
    it('should return rank index correctly', function() {
      assert.equal(new Card('2', '♠').getRankIndex(), 0);
      assert.equal(new Card('3', '♠').getRankIndex(), 1);
      assert.equal(new Card('4', '♠').getRankIndex(), 2);
      assert.equal(new Card('5', '♠').getRankIndex(), 3);
      assert.equal(new Card('6', '♠').getRankIndex(), 4);
      assert.equal(new Card('Q', '♠').getRankIndex(), 5);
      assert.equal(new Card('J', '♠').getRankIndex(), 6);
      assert.equal(new Card('K', '♠').getRankIndex(), 7);
      assert.equal(new Card('7', '♠').getRankIndex(), 8);
      assert.equal(new Card('A', '♠').getRankIndex(), 9);
    });
  });

});
