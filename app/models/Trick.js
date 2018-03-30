let Player = require('../../app/models/Player.js');
let Util = require('util');

class Trick {

    constructor(players, trumpSuit, firstPlayerId) {
        this._players = players;
        this._trumpSuit = trumpSuit;
        this.cardsPlayed = [];
        this.playersPlayed = [];
        this._suit = null;
        this._currentPlayerIdTurn = firstPlayerId;
        this.playerThatWon = null;
    }

    getNextPlayer() {
        if (this._trickHaveEnded()) {
            return null;
        }
        return this._currentPlayerIdTurn;
    }

    _trickHaveEnded() {
        return this.cardsPlayed.length === 4;
    }

    playCard(playerId, card) {

        let player = Player.getPlayer(this._players, playerId);

        if (player === null) {
            throw new Error(Util.format('Player with id %s doesnt exists', playerId));
        }

        if (Player.getPlayerIndex(this._players, playerId) !== this._currentPlayerIdTurn) {
            throw new Error(Util.format('Its not players %s turn, its %s', playerId, this._currentPlayerIdTurn));
        }

        if (this.cardsPlayed.length === 0) { //First card of the trick chooses the suit.
            this._suit = card.suit;
        } else if (card.suit !== this._suit &&
            player.hand.hasCardOfSuit(this._suit)) {
            throw new Error(Util.format('Player must play a card of suit: %s', this._suit));
        }

        if(!player.hand.removeCard(card)) {
            throw new Error(Util.format('Player %s doesnt have card %s', player.id, card.toString()));
        }

        this.cardsPlayed.push(card);
        this.playersPlayed.push(player);

        this._currentPlayerIdTurn = (this._currentPlayerIdTurn + 1) % 4;
    }

    finish() {
        if (!this._trickHaveEnded()) {
            throw new Error(Util.format('This trick still has %s cards to be played.', 4 - this.cardsPlayed.length));
        }
        
        let winningCard = this.cardsPlayed[0];
        let winningPlayer = this.playersPlayed[0];

        for (let i = 1; i < this.cardsPlayed.length; i++) {
            let card = this.cardsPlayed[i];

            let sameSuit = card.suit === winningCard.suit;
            let winByRank = card.getRankIndex() > winningCard.getRankIndex();
            let winByTrump = card.suit === this._trumpSuit;

            if ((sameSuit && winByRank) || (!sameSuit && winByTrump)) {
                winningCard = card;
                winningPlayer = this.playersPlayed[i];
            }
        }

        this.playerThatWon = winningPlayer;
    }
};

module.exports = Trick;
