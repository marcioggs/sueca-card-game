let Player = require('../../app/models/Player.js');
let Deck = require('../../app/models/Deck.js');
let Trick = require('../../app/models/Trick.js');
let Util = require('util');

class Game {

    constructor(players, startingPlayerId) {
        if (players.length != 4) {
            throw new Error('There must be 4 players in the room.');
        }
        if (Player.getPlayerIndex(players, startingPlayerId) === undefined) {
            throw new Error(Util.format('Player with index %s doesnt exists on players list', startingPlayerId));
        }

        this._players = players;
        this.startingPlayerId = startingPlayerId;
        this._deck = null;
        this._trick = null;
        this._cardsWonByTeam = [[], []];
        this.earnedPointsByTeam = [0, 0];
        this.trumpCard = null;
        this.earnedGameSetPoints = null;
        this.teamThatWon = null;
    }

    start() {
        this._deck = new Deck();
        this._deck.shuffleCards();
        this._distributeCards();
        let endingPlayerId = (this.startingPlayerId + 3) % 4;
        this.trumpCard = this._players[endingPlayerId].hand.getLastCard();
    }

    _distributeCards() {
        for (let i = 0; i < this._players.length; i++) {
            this._players[(this.startingPlayerId + i) % 4].hand = this._deck.getHand();
        }
    }

    startTrick() {
        if(this._isGameOver()) {
            return null;
        }
        if (this._trick != null) {
            throw new Error('There is already a trick in progress.');
        }
        this._trick = new Trick(this._players, this.trumpCard.suit, this.startingPlayerId);
        return this._trick;
    }

    _isGameOver() {
        return this._cardsWonByTeam[0].length + this._cardsWonByTeam[1].length === 40;
    }

    finishTrick() {
        if (this._trick === null) {
            throw new Error('There is no trick in progress.');
        }
        this._trick.finish();
        this._cardsWonByTeam[this._trick.playerThatWon.team] = this._cardsWonByTeam[this._trick.playerThatWon.team].concat(this._trick.cardsPlayed);
        this.startingPlayerId = this._trick.playerThatWon.id;
        this._trick = null;
    }

    finish() {
        if (!this._isGameOver()) {
            throw new Error('There arent 40 cards on the deck.');
        }
        this._calculateEarnedPointsByTeam();
        this._findOutTeamThatWon();
        if(!this.hasTied()) {
            this._calculateEarnedGameSetPoints();
        }
    }

    _calculateEarnedPointsByTeam() {
        for (let i = 0; i < this._cardsWonByTeam.length; i++) {
            for (let j = 0; j < this._cardsWonByTeam[i].length; j++) {
                this.earnedPointsByTeam[i] += this._cardsWonByTeam[i][j].point;
            }
        }
    }

    _findOutTeamThatWon() {
        if (this.earnedPointsByTeam[0] === this.earnedPointsByTeam[1]) {
            this.teamThatWon = null;
        } else if (this.earnedPointsByTeam[0] > this.earnedPointsByTeam[1]) {
            this.teamThatWon = 0;
        } else {
            this.teamThatWon = 1;
        }
    }

    _calculateEarnedGameSetPoints() {
        let earnedPoints = this.earnedPointsByTeam[this.teamThatWon];

        if (earnedPoints === 120) {
            this.earnedGameSetPoints = 4;
        } else if (earnedPoints > 90) {
            this.earnedGameSetPoints = 2;
        } else {
            this.earnedGameSetPoints = 1;
        }
    }

    hasTied() {
        return this.teamThatWon === null;
    }
      
};

module.exports = Game;
