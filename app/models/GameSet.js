let Player = require('../../app/models/Player.js');
let Game = require('../../app/models/Game.js');

class GameSet {

    constructor() {
        this.players = [];
        this.game = null;
        this.points = [0, 0];
        this._acumulatedDrawPoints = 0;
        this.playerIdToShuffleCards = 0;
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
        if(this._gameSetHasEnded()) {
            return null;
        }
        if (this.game != null) {
            throw new Error('There is already a game in progress.');
        }
        this.game = new Game(this.players, this.playerIdToShuffleCards);
        this.game.start();
        return this.game;
    }

    finishGame() {
        if (this.game === null) {
            throw new Error('There is no game in progress.');
        }
        this.game.finish();
        this._setPoints();
        this.playerIdToShuffleCards = (this.playerIdToShuffleCards + 1) % 4;
        this.game = null;
    }

    _setPoints() {
        if (this.game.wasDraw) {
            this._acumulatedDrawPoints++;
        } else {
            this.points[this.game.teamThatWon] += this.game.wonGameSetPoints + this._acumulatedDrawPoints;
            this._acumulatedDrawPoints = 0;
        }
    }

    finish() {
        if (!this._gameSetHasEnded()) {
            throw new Error('There are no teams with 4 points.');
        }
    }

    _gameSetHasEnded() {
        return this.points[0] >= 4 || this.points[1] >= 4;
    }
      
};

module.exports = GameSet;
