let assert = require('chai').assert;
let Trick = require('../../app/models/Trick.js');

describe('Trick', function() {

  describe('[constructor]', function() {
    let trick = new Trick();

    it('should create constructor properties properly', function() {
      assert.property(trick, 'cards');
      assert.property(trick, 'players');
      assert.property(trick, 'suit');
    });

  });

});


