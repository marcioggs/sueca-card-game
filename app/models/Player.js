class Player {
    constructor(id, name, team) {
        this.id = id;
        this.name = name;
        this.team = team;
        this.hand = null;
    }

    static getPlayer(players, id) {
        let player = null;
        let i = this.getPlayerIndex(players, id);
        if (i > -1) {
            player = players[i]
        }
        return player;
    }

    static getPlayerIndex(players, id) {
        return players.findIndex(e => e.id === id);
    }
};

module.exports = Player;
