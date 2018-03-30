let Card = require('./Card.js');
let Hand = require('./Hand.js');
let _ = require('lodash');

class Deck {

    constructor() {
        this.cards = this._createCards();
    }

    _createCards() {
        let cards = [];

        Card.allRanks().forEach(rank => {
            Card.allSuits().forEach(suit => {
                cards.push(new Card(rank, suit));
            });
        });

        return cards;
    }

    shuffleCards() {
        this.cards = _.shuffle(this.cards);
    }

    getHand() {
        if (this.cards.length < 10) {
            throw new Error('Deck doesnt have 10 cards.');
        }

        return new Hand(this.cards.splice(0, 10));
    }

};

module.exports = Deck;
