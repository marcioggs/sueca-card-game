let assert = require('assert');
let Trick = require('../../app/models/Trick.js');

describe('Trick', function() {

  describe('[constructor]', function() {
    let trick = new Trick();

    it('should create cards property', function() {
      assert.equal('cards' in trick, true);
    });

    it('should create players property', function() {
      assert.equal('players' in trick, true);
    });

    it('should create suit property', function() {
      assert.equal('suit' in trick, true);
    });
  });

});


