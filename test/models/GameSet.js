let assert = require('chai').assert;
let expect = require('chai').expect;
let GameSet = require('../../app/models/GameSet.js');
let Player = require('../../app/models/Player.js');
let Trick = require('../../app/models/Trick.js');
let Card = require('../../app/models/Card.js');
let Hand = require('../../app/models/Hand.js');

describe('GameSet', function() {

    describe('#addPlayer', function() {

        let gameSet;

        beforeEach(function() {
            gameSet = new GameSet();
        });

        it('should add player to the players list', function() {
            gameSet.addPlayer('Marcio');
            assert.equal(gameSet.players[0].name, 'Marcio');
        });

        it('should return player id', function() {
            assert.exists(gameSet.addPlayer('Marcio'));
        });

        it('should assign a team to the player', function() {
            gameSet.addPlayer('Marcio');
            assert.exists(gameSet.players[0].id);
        });

        it('should throw if there are already 4 players', function() {
            gameSet.addPlayer('Marcio');
            gameSet.addPlayer('Gabriel');
            gameSet.addPlayer('Gomes');
            gameSet.addPlayer('Silva');

            expect(function() {
                gameSet.addPlayer('Sauro');
            }).to.throw('Only 4 players are allowed.');
        });
    });

    describe('#startGame', function() {
        let gameSet = null;

        beforeEach(function() {
            gameSet = new GameSet();
            gameSet.addPlayer('Marcio');
            gameSet.addPlayer('Gabriel');
            gameSet.addPlayer('Gomes');
            gameSet.addPlayer('Silva');
        });

        it('should return null if the game set has already ended');

        it('should throw if there is already a game in progress', function() {
            gameSet.startGame();
            expect(function() {
                gameSet.startGame();
            }).to.throw('There is already a game in progress.');
        });

        it('should return a game', function() {
            assert.exists(gameSet.startGame());
        });
    });

    describe('#_setPoints', function() {

        let gameSet = null;
        beforeEach(function() {
            gameSet = new GameSet();
        });

        it('should accumulate points for the next game if the last one was draw', function() {
            gameSet.game = {
                wasDraw: true,
                teamThatWon: null,
                wonGameSetPoints: 1
            };
            gameSet._setPoints();
            assert.equal(gameSet.points[0], 0);
            assert.equal(gameSet.points[1], 0);

            gameSet.game = {
                wasDraw: false,
                teamThatWon: 1,
                wonGameSetPoints: 1
            };
            gameSet._setPoints();
            assert.equal(gameSet.points[1], 2);
        });

        it('should score points to the team that won', function() {
            gameSet.game = {
                wasDraw: false,
                teamThatWon: 0,
                wonGameSetPoints: 2
            };
            gameSet._setPoints();
            assert.equal(gameSet.points[0], 2);
        });
    });

    it('should play a full game without throwing', function() {
        let gameSet = new GameSet();

        gameSet.addPlayer('Marcio');
        gameSet.addPlayer('Gabriel');
        gameSet.addPlayer('Gomes');
        gameSet.addPlayer('Silva');

        let game = null;
        while (game = gameSet.startGame()) {
            mockGame(game);
            let i = 0;
            const cards = cardsToBePlayed(game.currentPlayerTurn);

            let trick = null;
            while(trick = game.startTrick()) {
                while(trick.getNextPlayer() !== null) {
                    trick.playCard(cards[i].id, cards[i].card);
                    i++;
                }
                game.finishTrick();
            }
            gameSet.finishGame();
        }

        gameSet.finish();
        assert.equal(gameSet.points[0], 3);
        assert.equal(gameSet.points[1], 4);
    });
});

function cardsToBePlayed(currentPlayerTurn) {
    let a = [];

    const p0 = currentPlayerTurn;
    const p1 = (currentPlayerTurn + 1) % 4;
    const p2 = (currentPlayerTurn + 2) % 4;
    const p3 = (currentPlayerTurn + 3) % 4;

    a.push({id: p0, card: new Card('2', '♠')});
    a.push({id: p1, card: new Card('3', '♠')});
    a.push({id: p2, card: new Card('5', '♠')});
    a.push({id: p3, card: new Card('4', '♠')});//team 0 won 0 points
    a.push({id: p2, card: new Card('J', '♠')});
    a.push({id: p3, card: new Card('7', '♠')});
    a.push({id: p0, card: new Card('2', '♥')});
    a.push({id: p1, card: new Card('6', '♠')});//team 0 won 13 points
    a.push({id: p0, card: new Card('Q', '♥')});
    a.push({id: p1, card: new Card('7', '♥')});
    a.push({id: p2, card: new Card('3', '♥')});
    a.push({id: p3, card: new Card('5', '♥')});//team 1 won 12 points
    a.push({id: p1, card: new Card('Q', '♠')});
    a.push({id: p2, card: new Card('K', '♠')});
    a.push({id: p3, card: new Card('J', '♥')});
    a.push({id: p0, card: new Card('K', '♥')});//team 0 won 13 points
    a.push({id: p0, card: new Card('4', '♣')});
    a.push({id: p1, card: new Card('2', '♣')});
    a.push({id: p2, card: new Card('3', '♣')});
    a.push({id: p3, card: new Card('J', '♣')});//team 1 won 3 points
    a.push({id: p3, card: new Card('A', '♥')});
    a.push({id: p0, card: new Card('5', '♣')});
    a.push({id: p1, card: new Card('7', '♣')});
    a.push({id: p2, card: new Card('4', '♥')});//team 1 won 21 points
    a.push({id: p3, card: new Card('K', '♣')});
    a.push({id: p0, card: new Card('6', '♣')});
    a.push({id: p1, card: new Card('4', '♦')});
    a.push({id: p2, card: new Card('A', '♠')});//team 1 won 15 points
    a.push({id: p3, card: new Card('J', '♦')});
    a.push({id: p0, card: new Card('2', '♦')});
    a.push({id: p1, card: new Card('5', '♦')});
    a.push({id: p2, card: new Card('3', '♦')});//team 1 won 3 points
    a.push({id: p3, card: new Card('K', '♦')});
    a.push({id: p0, card: new Card('Q', '♣')});
    a.push({id: p1, card: new Card('6', '♦')});
    a.push({id: p2, card: new Card('Q', '♦')});//team 1 won 8 points
    a.push({id: p3, card: new Card('A', '♦')});
    a.push({id: p0, card: new Card('A', '♣')});
    a.push({id: p1, card: new Card('7', '♦')});
    a.push({id: p2, card: new Card('6', '♥')}); //team 0 won 32 points

    return a;
}

function mockGame(game) {
    let cards = null;
    const startingPlayer = game.currentPlayerTurn;
  
    cards = [
      new Card('2', '♠'),
      new Card('2', '♥'),
      new Card('Q', '♥'),
      new Card('K', '♥'),
      new Card('4', '♣'),
      new Card('5', '♣'),
      new Card('6', '♣'),
      new Card('Q', '♣'),
      new Card('A', '♣'),
      new Card('2', '♦') ];
  
    game.players[startingPlayer].hand = new Hand(cards);
  
    cards = [
      new Card('3', '♠'),
      new Card('6', '♠'),
      new Card('Q', '♠'),
      new Card('7', '♥'),
      new Card('2', '♣'),
      new Card('7', '♣'),
      new Card('4', '♦'),
      new Card('5', '♦'),
      new Card('6', '♦'),
      new Card('7', '♦') ];
  
    game.players[(startingPlayer + 1) % 4].hand = new Hand(cards);
  
    cards = [
      new Card('5', '♠'),
      new Card('J', '♠'),
      new Card('K', '♠'),
      new Card('A', '♠'),
      new Card('3', '♥'),
      new Card('4', '♥'),
      new Card('6', '♥'),
      new Card('3', '♣'),
      new Card('3', '♦'),
      new Card('Q', '♦') ];
  
    game.players[(startingPlayer + 2) % 4].hand = new Hand(cards);
  
    cards = [
      new Card('4', '♠'),
      new Card('7', '♠'),
      new Card('5', '♥'),
      new Card('J', '♥'),
      new Card('A', '♥'),
      new Card('J', '♣'),
      new Card('K', '♣'),
      new Card('J', '♦'),
      new Card('K', '♦'),
      new Card('A', '♦') ];
  
    game.players[(startingPlayer + 3) % 4].hand = new Hand(cards);
    game.trumpCard = new Card('A', '♥');
  
    return game;
}
