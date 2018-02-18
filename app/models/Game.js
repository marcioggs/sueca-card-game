let Player = require('../../app/models/Player.js');
let Deck = require('../../app/models/Deck.js');
let Trick = require('../../app/models/Trick.js');
let Util = require('util');

class Game {

    constructor() {
        this.players = [];
        this.deck = null;
        this.currentPlayerTurn = null;
        this.trick = null;
        this.packOfCards = [[], []];
        this.trumpSuit = null;
        this.handPoints = [0, 0];
    }

    addPlayer(playerName) {
        if (this.players.length + 1 > 4) {
            throw new Error('Only 4 players are allowed.');
        }
        let player = new Player(this.players.length, playerName, this.players.length % 2);
        this.players.push(player);
        console.log('New player. Players count:', this.players.length);
    }

    start() {
        if (this.players.length != 4) {
            throw new Error('There must be 4 players in the room.');
        }

        this.deck = new Deck();
        this.deck.shuffleCards();
        this.trick = new Trick();

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand = this.deck.getHand();
            //console.log('Player', this.players[i], 'hand:', this.players[i].hand);
        }

        let lastCard = this.players[3].hand.getLastCard();
        this.trumpSuit = lastCard.suit;
        this.currentPlayerTurn = 0;
        //TODO: Mudar para o último a embaralhar.
        return lastCard;
    }

    playCard(playerId, card) {

        let player = Player.getPlayer(this.players, playerId);

        if (player == null) {
            throw new Error(Util.format('Player with id %s doesnt exists', playerId));
        }

        if (Player.getPlayerIndex(this.players, playerId) != this.currentPlayerTurn) {
            throw new Error(Util.format('Its not players %s turn, its %s', playerId, this.currentPlayerTurn));
        }

        if (this.trick.cards.length == 0) { //First card of the trick chooses the suit.
            this.trick.suit = card.suit;
        } else if (card.suit != this.trick.suit &&
                player.hand.hasCardOfSuit(this.trick.suit)) {
                throw new Error(Util.format('Player must play a card of suit: %s', this.trick.suit));
        }

        if(!player.hand.removeCard(card)) {
            throw new Error(Util.format('Player %s doesnt have card %s', player.id, card.toString()));
        }

        this.trick.cards.push(card);
        this.trick.players.push(player);

        this.currentPlayerTurn = (this.currentPlayerTurn + 1) % this.players.length;

        if (this.trick.cards.length == 4) {
            this._finishTrick();
            if (this.players[0].hand.cards.length == 0) {
                return this._finishHand();
            }
        }
        
    }

    _finishTrick() {
        let winningCard = this.trick.cards[0];
        let winningTeam = this.trick.players[0].team;
        let winningPlayerId = this.trick.players[0].id;

        for (let i = 1; i < this.trick.cards.length; i++) {
            let card = this.trick.cards[i];

            //TODO: Refactor to simplify.
            let winByTrumpCard = (card.suit == this.trumpSuit && winningCard.suit != this.trumpSuit);
            let lostByTrumpCard = (winningCard.suit == this.trumpSuit && card.suit != this.trumpSuit);
            let isFromTrickSuit = card.suit == this.trick.suit;
            let bothCardsHaveTrumpSuit = (card.suit == this.trumpSuit && winningCard.suit == this.trumpSuit)
            let winByHighestrank = (!lostByTrumpCard && !winByTrumpCard && (isFromTrickSuit || bothCardsHaveTrumpSuit) && card.getRankIndex() > winningCard.getRankIndex());

            if (winByTrumpCard || (winByHighestrank)) {
                winningCard = card;
                winningTeam = this.trick.players[i].team;
                winningPlayerId = this.trick.players[i].id;
            }
        }

        this.packOfCards[winningTeam] = this.packOfCards[winningTeam].concat(this.trick.cards);
        //The player that won the trick should start the next one.
        this.currentPlayerTurn = winningPlayerId;
        this.trick = new Trick();
    }

    _finishHand() {
        for (let i = 0; i < this.packOfCards.length; i++) {
            for (let j = 0; j < this.packOfCards[i].length; j++) {
                this.handPoints[i] = this.handPoints[i] + this.packOfCards[i][j].point;
            }
        }
        
        return this.handPoints;
    }
      
};

module.exports = Game;
