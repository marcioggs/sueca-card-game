const _ = require('lodash');

class Player {
    constructor(id, name, team) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.hand = null;
    }

    static getPlayer(players, id) {
        let player = _.find(players, player => player.id === id);
        return player;
    }

    static getPlayerIndex(players, id) {
        return players.findIndex(e => e.id === id);
    }
};

module.exports = Player;
