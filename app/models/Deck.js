let Card = require('./Card.js');
let Hand = require('./Hand.js');
let Utils = require('./Utils.js');

class Deck {

    constructor() {
        this.cards = this._createCards();
    }

    _createCards() {
        let cards = [];
        let ranks = Card.allRanks();
        let suits = Card.allSuits();

        for (let i = 0; i < ranks.length; i++) {
            for (let j = 0; j < suits.length; j++) {
                cards.push(new Card(ranks[i], suits[j]));
            }
        }

        return cards;
    }

    shuffleCards() {
        Utils.shuffle(this.cards);
    }

    getHand() {
        if (this.cards.length < 10) {
            throw new Error('Deck doesnt have 10 cards.');
        }

        return new Hand(this.cards.splice(0, 10));
    }

};

module.exports = Deck;
