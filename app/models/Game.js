let Player = require('../../app/models/Player.js');
let Deck = require('../../app/models/Deck.js');
let Trick = require('../../app/models/Trick.js');
let Util = require('util');

class Game {

    constructor(players, playerIdToShuffleCards) {
        if (players.length != 4) {
            throw new Error('There must be 4 players in the room.');
        }
        if (Player.getPlayerIndex(players, playerIdToShuffleCards) < 0) {
            throw new Error(Util.format('Player with index %s doesnt exists on players list', playerIdToShuffleCards));
        }

        this.players = players;
        this.playerIdToShuffleCards = playerIdToShuffleCards;
        this.deck = null;
        this.trick = null;
        this._cardsWonByTeam = [[], []];
        this.pointsWonByTeam = [0, 0];
        this.trumpCard = null;
        this.wasDraw = false;
        this.wonGameSetPoints = null;
        this.teamThatWon = null;
        this._playerIdThatWonLastTrick = null;
    }

    start() {
        this.deck = new Deck();
        this.deck.shuffleCards();
        this._distributeCards();
        let playerIdOnRightOfShuffler = (this.playerIdToShuffleCards + 3) % 4;
        this.trumpCard = this.players[playerIdOnRightOfShuffler].hand.getLastCard();
        this.currentPlayerTurn = this.playerIdToShuffleCards;
    }

    _distributeCards() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[(this.playerIdToShuffleCards + i) % 4].hand = this.deck.getHand();
        }
    }

    startTrick() {
        if(this._gameHaveEnded()) {
            return null;
        }
        if (this.trick != null) {
            throw new Error('There is already a trick in progress.');
        }
        let firstPlayerOnTrick = this._playerIdThatWonLastTrick === null? this.playerIdToShuffleCards : this._playerIdThatWonLastTrick;
        this.trick = new Trick(this.players, this.trumpCard.suit, firstPlayerOnTrick);
        return this.trick;
    }

    _gameHaveEnded() {
        return this._cardsWonByTeam[0].length + this._cardsWonByTeam[1].length === 40;
    }

    finishTrick() {
        if (this.trick === null) {
            throw new Error('There is no trick in progress.');
        }
        this.trick.finish();
        this._cardsWonByTeam[this.trick.playerThatWon.team] = this._cardsWonByTeam[this.trick.playerThatWon.team].concat(this.trick.cardsPlayed);
        this._playerIdThatWonLastTrick = this.trick.playerThatWon.id;
        this.trick = null;
    }

    finish() {
        if (!this._gameHaveEnded()) {
            throw new Error('There arent 40 cards on the deck.');
        }
        this._countWonCardPointsByTeam();
        this._countWonGamePointsByTeam();
    }

    _countWonCardPointsByTeam() {
        for (let i = 0; i < this._cardsWonByTeam.length; i++) {
            for (let j = 0; j < this._cardsWonByTeam[i].length; j++) {
                this.pointsWonByTeam[i] += this._cardsWonByTeam[i][j].point;
            }
        }
    }

    _countWonGamePointsByTeam() {
        let pointsWonByWinningTeam = null;
        if (this.pointsWonByTeam[0] === this.pointsWonByTeam[1]) {
            this.wasDraw = true;
            this.gamePoints = 0;
        } else if (this.pointsWonByTeam[0] > this.pointsWonByTeam[1]) {
            this.teamThatWon = 0;
        } else {
            this.teamThatWon = 1;
        }
        pointsWonByWinningTeam = this.pointsWonByTeam[this.teamThatWon];

        if (pointsWonByWinningTeam === 120) {
            this.wonGameSetPoints = 4;
        } else if (pointsWonByWinningTeam > 90) {
            this.wonGameSetPoints = 2;
        } else {
            this.wonGameSetPoints = 1;
        }
    }
      
};

module.exports = Game;
