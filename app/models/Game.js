let Player = require('../../app/models/Player.js');
let Deck = require('../../app/models/Deck.js');
let Trick = require('../../app/models/Trick.js');
let Util = require('util');

class Game {

    constructor(players, startingPlayerId) {
        if (players.length != 4) {
            throw new Error('There must be 4 players in the room.');
        }
        if (Player.getPlayerIndex(players, startingPlayerId) < 0) {
            throw new Error(Util.format('Player with index %s doesnt exists on players list', startingPlayerId));
        }

        this.players = players;
        this.startingPlayerId = startingPlayerId;
        this.deck = null;
        this.trick = null;
        this._cardsWonByTeam = [[], []];
        this.earnedPointsByTeam = [0, 0];
        this.trumpCard = null;
        this.tied = false;
        this.earnedGameSetPoints = null;
        this.teamThatWon = null;
    }

    start() {
        this.deck = new Deck();
        this.deck.shuffleCards();
        this._distributeCards();
        let endingPlayerId = (this.startingPlayerId + 3) % 4;
        this.trumpCard = this.players[endingPlayerId].hand.getLastCard();
    }

    _distributeCards() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[(this.startingPlayerId + i) % 4].hand = this.deck.getHand();
        }
    }

    startTrick() {
        if(this._isGameOver()) {
            return null;
        }
        if (this.trick != null) {
            throw new Error('There is already a trick in progress.');
        }
        this.trick = new Trick(this.players, this.trumpCard.suit, this.startingPlayerId);
        return this.trick;
    }

    _isGameOver() {
        return this._cardsWonByTeam[0].length + this._cardsWonByTeam[1].length === 40;
    }

    finishTrick() {
        if (this.trick === null) {
            throw new Error('There is no trick in progress.');
        }
        this.trick.finish();
        this._cardsWonByTeam[this.trick.playerThatWon.team] = this._cardsWonByTeam[this.trick.playerThatWon.team].concat(this.trick.cardsPlayed);
        this.startingPlayerId = this.trick.playerThatWon.id;
        this.trick = null;
    }

    finish() {
        if (!this._isGameOver()) {
            throw new Error('There arent 40 cards on the deck.');
        }
        this._calculateEarnedPoints();
        this._calculateEarnedGameSetPoints();
    }

    _calculateEarnedPoints() {
        for (let i = 0; i < this._cardsWonByTeam.length; i++) {
            for (let j = 0; j < this._cardsWonByTeam[i].length; j++) {
                this.earnedPointsByTeam[i] += this._cardsWonByTeam[i][j].point;
            }
        }
    }

    _calculateEarnedGameSetPoints() {
        let earnedPoints = null;
        if (this.earnedPointsByTeam[0] === this.earnedPointsByTeam[1]) {
            this.tied = true;
            this.gamePoints = 0;
        } else if (this.earnedPointsByTeam[0] > this.earnedPointsByTeam[1]) {
            this.teamThatWon = 0;
        } else {
            this.teamThatWon = 1;
        }
        earnedPoints = this.earnedPointsByTeam[this.teamThatWon];

        if (earnedPoints === 120) {
            this.earnedGameSetPoints = 4;
        } else if (earnedPoints > 90) {
            this.earnedGameSetPoints = 2;
        } else {
            this.earnedGameSetPoints = 1;
        }
    }
      
};

module.exports = Game;
