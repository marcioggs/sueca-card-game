let assert = require('assert');
let Card = require('../../app/models/Card.js') //TODO: All these ../ are creepy. See ttps://gist.github.com/branneman/8048520

describe('Card', function() {
  describe('[constructor]', function() {
    it('should return -1 when the value is not present', function() {
      //assert.equal([1,2,3].indexOf(4), -1);
      assert.equal(new Card('Q', '♠').point, 2);
    });
  });
});
