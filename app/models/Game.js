let Player = require('../../app/models/Player.js');
let Deck = require('../../app/models/Deck.js');

class Game {

    constructor() {
        this.players = [];
        this.deck = null;
        this.currentPlayerTurn = null;
        this.trick = null;
        this.packOfCards = [[], []];
        this.trumpSuit = null;
    }

    addPlayer(playerName) {
        if (this.players.length + 1 > 4) {
            throw new Error("Only 4 players are allowed.");
        }
        let player = new Player(this.players.length, playerName, this.players.length % 2);
        this.players.push(player);
        console.log("New player. Players count:", this.players.length);
    }

    start() {
        if (this.players.length != 4) {
            throw new Error("There must be 4 players in the room.");
        }

        this.deck = new Deck();
        this.deck.shuffleCards();

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].hand = this.deck.getHand();
            console.log("Player", this.players[i], "hand:", this.players[i].hand);
        }

        let lastCard = this.players[3].hand.getLastCard();
        this.trumpSuit = lastCard.suit;
        this.currentPlayerTurn = 0;
        //TODO: Mudar para o último a embaralhar.
        return lastCard;
    }

    playCard(player, card) {
        if(!player.hand.removeCard(card)) {
            throw new Error("Player", player, "doesn't has card", card);
        }

        if (this.trick.cards.length == 0) {
            this.trick.suit = card.suit;
        } else if (card.suit != this.trick.suit) {
            //TODO: Continue
        }
        //TODO: Validar se é do mesmo naipe puxado.

        this.trick.cards.push(card);
        this.trick.players.push(player);

        if (this.trick.cards.length == 4) {
            _finishTrick();
        }
    }

    _finishTrick() {
        let winningCard = this.trick.cards[0];
        let i;

        for (i = 1; i < this.trick.cards.length; i++) {
            card = this.trick.cards[i];

            if (card.suit == this.trumpSuit && winningCard.suit != this.trumpSuit) {
                winningCard = card;
            } else {
                if (card.suit > winningCard.rank) { 
                    winningCard = card;
                }
            }
        }

        let winningTeamPack = this.packOfCards[this.trick.players[i].team];
        winningTeamPack = winningTeamPack.concat(this.trick.cards);
    }
      
};

module.exports = Game;
