class Card {

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.point = this._setPoint(this.rank);
    }

    static allRanks() {
        return ['2', '3', '4', '5', '6', 'Q', 'J', 'K', '7', 'A'];
    }

    static allSuits() {
        return ['♠', '♥', '♦', '♣'];
    }

    static allPoints() {
        return [0, 0, 0, 0, 0, 2, 3, 4, 10, 11];
    }

    _setPoint(rank) {
        let i = Card.allRanks().findIndex(e => e == rank);
        return Card.allPoints()[i];
    }
};

module.exports = Card;
