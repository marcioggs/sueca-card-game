const _ = require('lodash');

class Hand {

    constructor(cards) {
        this.cards = cards;
    }

    removeCard(card) {
        let i = this.cards.findIndex(e => e.rank === card.rank && e.suit === card.suit);
        if (i > -1) {
            this.cards.splice(i, 1);
        }
        return i > -1;
    }

    getLastCard() {
        return this.cards[this.cards.length - 1];
    }

    hasCardOfSuit(suit) {

        const i = _.findIndex(this.cards, card => card.suit === suit);
        return i >= 0;
    }
};

module.exports = Hand;
