class Hand {

    constructor(cards) {
        this.cards = cards;
    }

    removeCard(card) {
        let i = this.cards.findIndex(e => e.rank == card.rank && e.suit == card.suit);
        if (i > -1) {
            this.cards.splice(i, 1);
        }
        return i > -1;
    }

    getLastCard() {
        return this.cards[this.cards.length - 1];
    }

    hasCardOfSuit(suit) {
        let found = false;

        for (let i = 0; i < this.cards.length && !found; i++) {
            if (this.cards[i].suit == suit) {
                found = true;
            }
        }

        return found;
    }
};

module.exports = Hand;
