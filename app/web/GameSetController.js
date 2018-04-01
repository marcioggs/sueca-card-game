const socketIo = require('socket.io');
const GameSet = require('./models/GameSet.js');
const _ = require('lodash');

class GameSetController {
  constructor(server) {
    this.io = socketIo(server);
    this.gameSet = new GameSet();
    this.game = null;
    this.trick = null;
    this.playersIds = [];

    io.on('connection', this.bindEvents);
  }

  //TODO: Handle errors thrown over the model.

  bindEvents(socket) {
    socket.on('setName', function(name) {
      //TODO: Is there a better way to get the socket reference?
      this.setName(name, socket);
    });
    socket.on('playCard', function(card) {
      this.playCard(card, socket);
    });
    socket.on('disconnect', function() {
      //TODO: Handle disconnection.
      console.log('Someone disconnected.');
    });
  }

  setName(name, socket) {
    let player = this.gameSet.addPlayer(name);
    socket.emit('nameSet', player.name);
    this.playersIds.push({
      id: player.id,
      socketId: socket.id
    });
    this.io.emit('playerListChanged', this.gameSet.players);
    
    if (this.gameSet.players.length === 4) {
      this.startGame();
    }
  }
  
  startGame() {
    this.game = this.gameSet.startGame();
    sendCardsToPlayers(this.game.trumpCard);

    if (this.game !== null) {
      this.startTrick();
    } else {
      this.finishGameSet();
    }
  }

  sendCardsToPlayers(trumpCard) {
    //TODO: Find if is better to use from game or gameSet and remove _ if needed.
    this.game._players.forEach(player => {
      let socketId = _.find(this.playersIds, p => p.id === player.id).socketId;
      this.io.to(socketId).emit('gameStarted', {
        hand: player.hand,
        trumpCard: trumpCard
      });
    });
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
      //TODO: Send just to the players socket?
      io.emit('playCard', playerId);
      //TODO: Inform everyone who is playing.
      io.emit('playerTurn');
    } else {
      this.finishTrick();
      this.startTrick()
    }
  }

  playCard(card, socket) {
    let player = _.find(this.playersIds, player => player.socketId === socket.id);
    this.trick.playCard(player.id, card);
    //TODO: Inform the played card.
    this.io.emit('cardPlayed');
    this.askNextPlayerToPlay();
  }

  finishTrick() {
    this.game.finishTrick();
    this.io.emit('trickFinished');
  }

  finishGame() {
    this.gameSet.finishGame();
    this.io.emit('gameFinished');
  }
  
  finishGameSet() {
    this.gameSet.finish();
    this.io.emit('gameSetFinished');
    console.log(gameSet.points);
  }

}