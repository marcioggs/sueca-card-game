let assert = require('assert');
let Player = require('../../app/models/Player.js');

describe('Player', function() {

  describe('[constructor]', function() {
    let player = new Player(1, 'John');

    it('first param should be put on id property', function() {
      assert.equal(player.id, 1); 
    });

    it('second param should be put on name property', function() {
      assert.equal(player.name, 'John'); 
    });

  });

});


