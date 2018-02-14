let assert = require('chai').assert;
let Player = require('../../app/models/Player.js');

describe('Player', function() {

  describe('[constructor]', function() {
    let player = new Player(1, 'John', 2);

    it('first param should be stored on id property', function() {
      assert.equal(player.id, 1); 
    });

    it('second param should be stored on name property', function() {
      assert.equal(player.name, 'John'); 
    });

    it('third param should be stored on team property', function() {
      assert.equal(player.team, 2); 
    });

  });

});


