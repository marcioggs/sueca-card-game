const socketIo = require('socket.io');
const GameSet = require('../models/GameSet.js');
const _ = require('lodash');

class GameSetController {
  constructor(server) {
    this.io = socketIo(server);
    this.gameSet = new GameSet();
    this.game = null;
    this.trick = null;
    this.playersSockets = [];

    this.bindEvents.bind(this);

    //this.io.on('connection', this.bindEvents);
    //TODO: How to use the line above and pass the class as THIS?
    this.io.on('connection', (socket) => {
      //let self = this;
      socket.on('setName', (name) => {
        this.setName(socket, name);
      });
      socket.on('playCard', (card) => {
        this.playCard(socket, card);
      });
      socket.on('disconnect', () => {
        this.io.emit('gameSetFinishedWithError', 'Someone disconnected');
      });
    });
  }

  //TODO: Handle errors thrown over the model.
/* 
  bindEvents(socket) {
    //let self = this;
    socket.on('setName', (name) => {
      this.setName(socket, name);
    });
    socket.on('playCard', (card) => {
      this.playCard(socket, card);
    });
    socket.on('disconnect', () => {
      this.io.emit('gameSetFinishedWithError', 'Someone disconnected');
    });
  } */

  setName(socket, name) {
    let player = this.gameSet.addPlayer(name);
    socket.emit('nameSet', player);
    this.playersSockets.push({
      id: player.id,
      socket: socket
    });
    this.io.emit('playerListChanged', this.gameSet.players);
    
    if (this.gameSet.players.length === 4) {
      this.startGame();
    }
  }
  
  startGame() {
    this.game = this.gameSet.startGame();
    if (this.game !== null) {
      this.sendCardsToPlayers();
      this.startTrick();
    } else {
      this.finishGameSet();
    }
  }

  sendCardsToPlayers() {
    this.gameSet.players.forEach(player => {
      let socket = this.getSocket(player.id);
      this.io.to(socket.id).emit('gameStarted', {
        hand: player.hand,
        trumpCard: this.game.trumpCard
      });
    });
  }

  getSocket(playerId) {
    return _.find(this.playersSockets, playerIds => playerIds.id === playerId).socket;
  }
  
  startTrick() {
    this.trick = this.game.startTrick();
    this.io.emit('trickStarted');

    if (this.trick !== null) {
      this.askNextPlayerToPlay();
    } else {
      this.finishGame();
      this.startGame();
    }
  }
  
  askNextPlayerToPlay() { 
    let playerId = this.trick.getNextPlayer();
    if (playerId !== null) {
      let socket = this.getSocket(playerId);
      this.io.to(socket.id).emit('playCard');
      socket.broadcast.emit('playerTurn', playerId);
    } else {
      this.finishTrick();
      this.startTrick()
    }
  }

  playCard(socket, card) {
    let player = this.getPlayer(socket.id);
    this.trick.playCard(player.id, card);
    this.io.emit('cardPlayed', card);
    this.askNextPlayerToPlay();
  }

  getPlayer(socketId) {
    return _.find(this.playersSockets, player => player.socket.Id === socketId);
  }

  finishTrick() {
    this.game.finishTrick();
    this.io.emit('trickFinished');
  }

  finishGame() {
    this.gameSet.finishGame();
    this.io.emit('gameFinished', this.gameSet.points);
  }
  
  finishGameSet() {
    this.gameSet.finish();
    this.io.emit('gameSetFinished');
    console.log(gameSet.points);
  }

}

module.exports = GameSetController;
