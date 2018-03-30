let Player = require('../../app/models/Player.js');
let Game = require('../../app/models/Game.js');

class GameSet {

    constructor() {
        this.players = [];
        this.game = null;
        this.points = [0, 0];
        this._accumulatedPoints = 0;
        this.startingPlayerId = 0;
    }

    addPlayer(playerName) {
        if (this.players.length + 1 > 4) {
            throw new Error('Only 4 players are allowed.');
        }
        let player = new Player(this.players.length, playerName, this.players.length % 2);
        this.players.push(player);

        return player.id;
    }

    startGame() {
        if(this._isGameSetOver()) {
            return null;
        }
        if (this.game != null) {
            throw new Error('There is already a game in progress.');
        }
        this.game = new Game(this.players, this.startingPlayerId);
        this.game.start();
        return this.game;
    }

    finishGame() {
        if (this.game === null) {
            throw new Error('There is no game in progress.');
        }
        this.game.finish();
        this._calculatePoints();
        this.startingPlayerId = (this.startingPlayerId + 1) % 4;
        this.game = null;
    }

    _calculatePoints() {
        if (this.game.hasTied()) {
            this._accumulatedPoints++;
        } else {
            this.points[this.game.teamThatWon] += this.game.earnedGameSetPoints + this._accumulatedPoints;
            this._accumulatedPoints = 0;
        }
    }

    finish() {
        if (!this._isGameSetOver()) {
            throw new Error('There are no teams with 4 points.');
        }
    }

    _isGameSetOver() {
        return this.points[0] >= 4 || this.points[1] >= 4;
    }
      
};

module.exports = GameSet;
