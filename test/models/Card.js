let assert = require('assert');
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
});
