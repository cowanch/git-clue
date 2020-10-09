<!--
  The main game component. Handles the game logic and components.
-->
<template>
  <div class="css-container">
    <board :token-coordinates="tokenCoordinates"
           :available-moves="availableMoves"
           @move="movePhase"
           @passage="movePassage"/>
    <div class="css-options">
      <player-select v-if="selectingPlayers"
                     v-model="playerSelections"
                     @finish="selectingPlayers=false"/>
      <player-panel v-else
                    :cards="playerCards[humanPlayer]"
                    :card-selection="cardSelection"
                    :turn-phase="turnPhase"
                    :player-position="this.turnPlayerPosition"
                    :messages="messages"
                    :game-over="playerGameOver[this.turnPlayer]"
                    :player-won="hasPlayerWon"
                    :is-human-turn="isHumanPlayer(this.turnPlayer)"
                    :cpu-action="cpuAction"
                    @die-rolled="rollPhase"
                    @suggest="suggestPhase"
                    @accuse="accusePhase"
                    @end-turn="endTurn"
                    @show-suggest-options="suggestOptionsShown"
                    @disprove="disprovePhase"/>
    </div>
  </div>
</template>

<style>
html,
body,
body > div {
  height: 100%;
}

.css-container {
  display: flex;
}

.css-options {
  width: 50%;
}
</style>

<script>
// Components
import Board from '@/components/board/Board';
import PlayerSelect from '@/components/controls/PlayerSelect';
import PlayerPanel from '@/components/controls/PlayerPanel';
// Specs
import startingPositions from '@/specs/startingPositions';
import grid from '@/specs/boardSpecs';
import {playerTypes} from '@/specs/playerTypeSpecs';
// Utils
import shuffle from '@/utils/shuffle';
// Mixins
import rooms from '@/mixins/rooms.mixin';
import deckUtil from '@/mixins/deck.mixin';
import turnPhases from '@/mixins/turnPhases.mixin';
// Computer Player AI
import CpuEasy from '@/cpu/CpuEasy';

export default {
  name: 'Game',
  mixins: [rooms,deckUtil,turnPhases],
  data () {
    return {
      playerCoordinates: {},
      lastTurnCoordinates: {},
      playerSelections: {},
      playerCards: {},
      playerGameOver: {},
      hasPlayerWon: false,
      weaponCoordinates: {},
      currentTurn: -1,
      dieRoll: 0,
      selectingPlayers: true,
      envelope: {},
      turnPhase: null,
      messages: [],
      cardSelection: [],
      cpuAction: '',
      cpuPlayers: {},
      availableMovesOverride: {}
    };
  },
  computed: {
    tokenCoordinates () {
      return {
        players: this.playerCoordinates,
        weapons: this.weaponCoordinates
      }
    },
    turnOrder () {
      return Object.keys(this.playerCoordinates).filter(player => !!this.playerCoordinates[player]);
    },
    turnPlayer () {
      return this.turnOrder[this.currentTurn];
    },
    turnPlayerPosition () {
      return this.playerCoordinates[this.turnPlayer];
    },
    turnPlayerLastPosition: {
      get () { return this.lastTurnCoordinates[this.turnPlayer]; },
      set (coordinates) { this.lastTurnCoordinates[this.turnPlayer] = coordinates }
    },
    humanPlayer () {
      return Object.keys(this.playerSelections).find(key => this.isHumanPlayer(key));
    },
    availableMoves () {
      if (Object.keys(this.availableMovesOverride).length > 0) {
        return this.availableMovesOverride;
      }
      let availableMoves = {};
      if (this.dieRoll > 0) {
        availableMoves = this.findAvailableMoves(this.turnPlayerPosition, this.dieRoll);
      } else if (this.isRollPhase(this.turnPhase)) {
        availableMoves = this.checkSecretPassages(this.turnPlayerPosition);
      }
      return availableMoves;
    },
    gridMap () {
      // Convert the board specs into an object that's easy to access
      let map = {
        doors: {}
      };
      for (let rowIdx in grid) {
        for (let cell of grid[rowIdx]) {
          let x = cell.col;
          if (!map.hasOwnProperty(x)) {
            map[x] = {};
          }
          let y = parseInt(rowIdx);
          // Check to see if this cell has an adjacent room
          if (cell.room) {
            map[x][y] = { room: cell.room };
            // Add this position as a reverse lookup from the room
            if (!map.doors.hasOwnProperty(cell.room)) {
              map.doors[cell.room] = [];
            }
            map.doors[cell.room].push({ x:x, y:y });
          } else {
            map[x][y] = true;
          }
        }
      }
      return map;
    },
    gridCenter () {
      let maxX = 0;
      let maxY = 0;
      Object.keys(this.gridMap).forEach(x => {
        if (parseInt(x) > maxX) {
          maxX = parseInt(x);
        }
        Object.keys(this.gridMap[x]).forEach(y => {
          if (parseInt(y) > maxY) {
            maxY = parseInt(y);
          }
        });
      });
      return { x: Math.floor(maxX/2), y: Math.floor(maxY/2) };
    },
    doorSpaces () {
      let doorSpaces = {};
      Object.keys(this.gridMap).forEach(x => {
        Object.keys(this.gridMap[x]).forEach(y => {
          let room = this.gridMap[x][y].room;
          if (this.isValidRoom(room)) {
            if (!doorSpaces.hasOwnProperty(room)) {
              doorSpaces[room] = [];
            }
            doorSpaces[room].push({x:parseInt(x),y:parseInt(y)});
          }
        });
      });
      return doorSpaces;
    }
  },
  created () {
    // Set up the different player settings
    Object.keys(this.suspects).forEach(player => {
      this.$set(this.playerCoordinates, player, null);
      this.$set(this.lastTurnCoordinates, player, null);
      this.$set(this.playerSelections, player, playerTypes.DISABLED);
      this.$set(this.playerCards, player, []);
      this.$set(this.playerGameOver, player, false);
    });
    let roomKeys = Object.keys(this.rooms);
    Object.keys(this.weapons).forEach(weapon => {
      let rand = Math.floor(Math.random() * roomKeys.length);
      this.$set(this.weaponCoordinates, weapon, roomKeys[rand]);
      roomKeys.splice(rand, 1);
    });
    this.addMessage('Welcome to Clue!');
    this.currentTurn = -1;

    this.playerSelections.scarlet = playerTypes.CPU_EASY;
    this.playerSelections.mustard = playerTypes.CPU_EASY;
    this.playerSelections.white = playerTypes.CPU_EASY;
    this.playerSelections.green = playerTypes.CPU_EASY;
    this.playerSelections.peacock = playerTypes.CPU_EASY;
    this.playerSelections.plum = playerTypes.CPU_EASY;
  },
  methods: {
    findAvailableMoves (start, moves) {
      let pathStart = [];
      let positions = [];
      let remaining = moves;
      // If the player is in a room, they can have multiple starting points
      if (this.gridMap.doors.hasOwnProperty(start)) {
        pathStart.push(start);
        positions = this.gridMap.doors[start];
        remaining--;
      } else {
        positions.push(start);
      }
      let availableMoves = {};
      positions.forEach(position => {
        let path = pathStart.concat([position]);
        this.addNextMove(position, path, remaining, availableMoves);
      });
      return availableMoves;
    },
    addNextMove (position, path, remaining, availableMoves) {
      let { x, y } = position;
      if (remaining === 0) {
        // End of our recursive chain
        if (!availableMoves.hasOwnProperty(x)) {
          availableMoves[x] = {};
        }
        availableMoves[x][y] = true;
      } else {
        // Up
        let upPosition = { x: x, y: y-1 };
        this.findAvailableMoveFromPosition(upPosition, path, remaining, availableMoves);
        // Down
        let downPosition = { x: x, y: y+1 };
        this.findAvailableMoveFromPosition(downPosition, path, remaining, availableMoves);
        // left
        let leftPosition = { x: x-1, y: y };
        this.findAvailableMoveFromPosition(leftPosition, path, remaining, availableMoves);
        // Right
        let rightPosition = {x: x+1, y: y};
        this.findAvailableMoveFromPosition(rightPosition, path, remaining, availableMoves);
        // Rooms
        // If this room has a door to a room, that room is available to enter
        let room = this.adjacentRoom(position);
        if (room && !this.isRoomOnPath(room, path)) {
          availableMoves[room] = true;
        }
      }
    },
    findAvailableMoveFromPosition (position, path, remaining, availableMoves) {
      // A move can be traversed if
      // - it exists in the grid map
      // - another token is not occupying it
      // - the move position does not exist in the path
      if (this.isPositionOnBoard(position) && !this.isPositionOnPath(position, path) && !this.isPlayerOnPosition(position)) {
        let newPath = path.slice();
        newPath.push(position);
        this.addNextMove(position, newPath, remaining-1, availableMoves);
      }
    },
    findShortestPathToRoom (room, start) {
      return this.findNextSpaceToTarget(room, start, []);
    },
    findDistanceBetween (space1, space2) {
      return Math.sqrt(Math.pow(space1.x - space2.x, 2) + Math.pow(space1.y - space2.y, 2));
    },
    findClosestDoorSpace (room, position) {
      let lowest = 0;
      let closestSpace = null;
      this.doorSpaces[room].forEach(space => {
        let distance = this.findDistanceBetween(space, position);
        if (!closestSpace || distance < lowest) {
          closestSpace = space;
          lowest = distance;
        }
      });
      return closestSpace;
    },
    findNextSpaceToTarget (room, position, path) {
      // Find the current closest door
      let targetSpace = this.findClosestDoorSpace(room, position);
      if (targetSpace.x === position.x && targetSpace.y === position.y) {
        return path;
      } else {
        let { x, y } = position;
        let neighbours = [];
        let upPosition = { x: x, y: y-1 };
        if (this.isValidPosition(upPosition, path)) {
          neighbours.push(upPosition);
        }
        let downPosition = { x: x, y: y+1 };
        if (this.isValidPosition(downPosition, path)) {
          neighbours.push(downPosition);
        }
        let leftPosition = { x: x-1, y: y };
        if (position.x === 14 && position.y === 15) {
          let x = 0;
          x = 14;
          console.log(x);
          console.log(this.isValidPosition(leftPosition, path));
        }
        if (this.isValidPosition(leftPosition, path)) {
          neighbours.push(leftPosition);
        }
        let rightPosition = {x: x+1, y: y};
        if (this.isValidPosition(rightPosition, path)) {
          neighbours.push(rightPosition);
        }
        let lowest = 0;
        let nextSpace = null;
        let currentDistance = this.findDistanceBetween(position, targetSpace);
        if (position.x === 14 && position.y === 15) {
          console.log(`Current Space: ${position.x},${position.y}`);
          console.log(`Current Distance: ${currentDistance}`);
        }
        neighbours.forEach(space => {
          let nextTarget = null;
          let distance = 0;
          if (currentDistance > 9.5) {
            if (position.x === 14 && position.y === 14) {
              console.log(`Choosing a midpoint target: ${currentDistance}`);
            }
            nextTarget = {
              x: (this.gridCenter.x + targetSpace.x) / 2,
              y: (this.gridCenter.y + targetSpace.y) / 2
            };
          } else {
            nextTarget = this.findClosestDoorSpace(room, space);
          }
          distance = this.findDistanceBetween(space, nextTarget);
          if (position.x === 14 && position.y === 15) {
            console.log('NEW SPACE');
            console.log(space);
            console.log(nextTarget);
            console.log(distance);
            console.log(this.getClosestNeighbour(nextTarget, space, path));
          }
          if (!nextSpace || distance < lowest) {
            nextSpace = space;
            lowest = distance;
          } else if (distance === lowest) {
            if (position.x === 14 && position.y === 15) {
              console.log('TIEBREAKER REQUIRED');
            }
          }
        });
        if (!nextSpace) {
          return path;
        }
        path.push(nextSpace);
        return this.findNextSpaceToTarget(room, nextSpace, path);
      }
    },
    pathTiebreaker (space1, space2, room, path) {
      let targetSpace1 = this.findClosestDoorSpace(room, space1);
      let nextSpace1 = this.getClosestNeighbour(targetSpace1, space1, path);
      let distance1 = this.findDistanceBetween(nextSpace1, targetSpace1);

      let targetSpace2 = this.findClosestDoorSpace(room, space2);
      let nextSpace2 = this.getClosestNeighbour(targetSpace2, space2, path);
      let distance2 = this.findDistanceBetween(nextSpace2, targetSpace2);

      if (distance1 < distance2) {
        return space1
      } else if (distance2 <)
    },
    getClosestNeighbour (target, position, path) {
      let { x, y } = position;
      let neighbours = [];
      let upPosition = { x: x, y: y-1 };
      if (this.isValidPosition(upPosition, path)) {
        neighbours.push(upPosition);
      }
      let downPosition = { x: x, y: y+1 };
      if (this.isValidPosition(downPosition, path)) {
        neighbours.push(downPosition);
      }
      let leftPosition = { x: x-1, y: y };
      if (this.isValidPosition(leftPosition, path)) {
        neighbours.push(leftPosition);
      }
      let rightPosition = {x: x+1, y: y};
      if (this.isValidPosition(rightPosition, path)) {
        neighbours.push(rightPosition);
      }
      let lowest = 0;
      let closestNeighbour = null;
      neighbours.forEach(space => {
        let distance = this.findDistanceBetween(space, target);
        if (!closestNeighbour || distance < lowest) {
          lowest = distance;
          closestNeighbour = space;
        }
      });
      return closestNeighbour;
    },
    getGridMapRow (y) {
      let row = [];
      Object.keys(this.gridMap).forEach(col => {
        if (Object.keys(this.gridMap[col]).includes(`${y}`)) {
          row.push(parseInt(col));
        }
      });
      row.sort((val1, val2) => val1 > val2);
      return row;
    },
    isValidPosition (position, path) {
      return this.isPositionOnBoard(position) && !this.isPositionOnPath(position, path) && !this.isPlayerOnPosition(position);
    },
    isPositionOnBoard (position) {
      let { x, y } = position;
      return this.gridMap.hasOwnProperty(x) && this.gridMap[x].hasOwnProperty(y);
    },
    adjacentRoom (position) {
      if (this.isPositionOnBoard(position) && this.gridMap[position.x][position.y].room) {
        return this.gridMap[position.x][position.y].room;
      }
      return null;
    },
    isPositionOnPath (position, path) {
      return path.some(pathPosition => position.x === pathPosition.x && position.y === pathPosition.y);
    },
    isRoomOnPath (room, path) {
      return path.some(pathRoom => room === pathRoom);
    },
    isPlayerOnPosition (position) {
      return Object.values(this.playerCoordinates).some(playerPosition => playerPosition !== null && position.x === playerPosition.x && position.y === playerPosition.y);
    },
    checkSecretPassages (position) {
      let availablePassage = {};
      let room = this.getSecretPassageRoom(position);
      if (room) {
        availablePassage[`passage-${room}`] = true;
      }
      return availablePassage;
    },
    isHumanPlayer (player) {
      return this.playerSelections[player] === playerTypes.HUMAN;
    },
    isCpuPlayer (player) {
      return this.playerSelections[player] === playerTypes.CPU_EASY ||
             this.playerSelections[player] === playerTypes.CPU_MEDIUM ||
             this.playerSelections[player] === playerTypes.CPU_HARD;
    },
    getRemainingDeckAfterPickingEnvelopeCards () {
      let suspectDeck = shuffle(Object.keys(this.suspects));
      let weaponDeck = shuffle(Object.keys(this.weapons));
      let roomDeck = shuffle(Object.keys(this.rooms));
      this.envelope.suspect = suspectDeck.shift();
      this.envelope.weapon = weaponDeck.shift();
      this.envelope.room = roomDeck.shift();

      return [...suspectDeck, ...weaponDeck, ...roomDeck];
    },
    dealCardsToPlayers (deck) {
      // This method assumes a shuffled deck
      let playerCount = this.turnOrder.length;
      deck.forEach((card, index) => {
        this.playerCards[this.turnOrder[index % playerCount]].push(card);
      });
    },
    rollPhase (roll) {
      if (this.isRollPhase(this.turnPhase)) {
        this.dieRoll = roll;
        this.turnPhase = this.phases.MOVE;
      }
    },
    movePhase (moveTo) {
      if (this.turnPhase === this.phases.MOVE) {
        // Move the player and reset the die
        this.movePlayerTo(this.turnPlayer, moveTo);
        this.dieRoll = 0;
        // Check to see if the player is in a room
        if (this.isValidRoom(this.turnPlayerPosition)) {
          this.turnPhase = this.phases.SUGGEST;
        } else {
          this.endTurn();
        }
      }
    },
    movePassage (moveTo) {
      if (this.isRollPhase(this.turnPhase)) {
        // Make sure the room being moved to is a secret passage room
        if (this.isSecretPassageRoom(moveTo)) {
          // Move the player to the room and change the phase to suggest
          this.movePlayerTo(this.turnPlayer, moveTo);
          this.turnPhase = this.phases.SUGGEST;
        }
      }
    },
    suggestPhase (suggestion) {
      // Suggestion made, find a player that can disprove it
      this.addSuggestionMessage(suggestion);
      // Move the suggested suspect into the suggested room
      if (this.playerCoordinates[suggestion.suspect]) {
        this.playerCoordinates[suggestion.suspect] = suggestion.room;
      }
      // Move the suggested weapon into the suggested room
      this.weaponCoordinates[suggestion.weapon] = suggestion.room;
      let turnIter = (this.currentTurn + 1) % this.turnOrder.length;
      let disproved = false;
      while (turnIter !== this.currentTurn) {
        let currentPlayer = this.turnOrder[turnIter];
        let cards = this.playerCards[currentPlayer];
        let disprovingCards = this.getDisprovingCards(cards, suggestion);
        if (disprovingCards.length > 0) {
          disproved = true;
          this.addMessage(`${this.suspects[currentPlayer]} can disprove the suggestion`);
          this.handleDisprovingCards(currentPlayer, disprovingCards);
          break;
        } else {
          this.addMessage(`${this.suspects[currentPlayer]} cannot disprove the suggestion`);
        }
        turnIter = (turnIter + 1) % this.turnOrder.length;
      }
      if (!disproved) {
        this.turnPhase = this.phases.END;
      }
    },
    accusePhase (accusation) {
      // Accusation made, check the envelope to see if it's correct
      this.addAccusationMessage(accusation);
      let isCorrect = Object.keys(accusation).every(key => accusation[key] === this.envelope[key]);
      if (isCorrect) {
        this.addMessage(`Correct! ${this.suspects[this.turnPlayer]} wins!`);
        this.hasPlayerWon = true;
      } else {
        this.addMessage(`Incorrect - ${this.suspects[this.turnPlayer]} must sit out`);
        this.playerGameOver[this.turnPlayer] = true;
        this.turnPhase = this.phases.END;
      }
    },
    handleDisprovingCards (player, cards) {
      if (this.isHumanPlayer(player)) {
        this.turnPhase = this.phases.DISPROVE;
        this.cardSelection = cards;
      } else if (this.isCpuPlayer(player)) {
        let rand = Math.floor(Math.random() * cards.length);
        let card = cards[rand];
        if (this.isHumanPlayer(this.turnPlayer)) {
          this.addMessage(`${this.suspects[player]} reveals ${this.getCardText(card)}`);
        }
        this.turnPhase = this.phases.END;
      }
    },
    getDisprovingCards (cards, suggestion) {
      let disprovingCards = [];
      let { suspect, weapon, room } = suggestion;
      if (cards.includes(suspect)) {
        disprovingCards.push(suspect);
      }
      if (cards.includes(weapon)) {
        disprovingCards.push(weapon);
      }
      if (cards.includes(room)) {
        disprovingCards.push(room);
      }
      return disprovingCards;
    },
    disprovePhase (card) {
      if (this.turnPhase === this.phases.DISPROVE) {
        // Do something here handling CPU users receiving a clue
        this.cardSelection = [];
        this.addMessage(`${this.suspects[this.humanPlayer]} reveals ${this.getCardText(card)} to ${this.suspects[this.turnPlayer]}`);
        this.turnPhase = this.phases.END;
      }
    },
    movePlayerTo (player, moveTo) {
      if (this.playerCoordinates.hasOwnProperty(player)) {
        this.playerCoordinates[player] = moveTo;
      }
    },
    endTurn () {
      this.clearMessages();
      this.turnPlayerLastPosition = this.turnPlayerPosition;
      this.currentTurn++;
    },
    suggestOptionsShown (shown) {
      if (shown && this.turnPhase === this.phases.ROLL_OR_SUGGEST) {
        this.turnPhase = this.phases.SUGGEST;
      }
    },
    addSuggestionMessage (suggestion) {
      let {suspect, weapon, room} = suggestion;
      let suspectText = this.suspects[suspect];
      let weaponText = this.weapons[weapon];
      let roomText = this.rooms[room];
      this.addMessage(`${this.suspects[this.turnPlayer]} suggests ${suspectText} with the ${weaponText} in the ${roomText}`);
    },
    addAccusationMessage (accusation) {
      let {suspect, weapon, room} = accusation;
      let suspectText = this.suspects[suspect];
      let weaponText = this.weapons[weapon];
      let roomText = this.rooms[room];
      this.addMessage(`${this.suspects[this.turnPlayer]} accuses ${suspectText} of committing the crime in the ${roomText} with the ${weaponText}`);
    },
    addMessage (message) {
      this.messages.push(message);
    },
    clearMessages () {
      this.messages = [];
    }
  },
  watch: {
    currentTurn (turn) {
      if (turn > this.turnOrder.length-1) {
        this.currentTurn = 0;
      } else if (turn < 0) {
        this.currentTurn = this.turnOrder.length-1;
      }
    },
    turnPlayer (player) {
      if (!this.playerGameOver[player]) {
        this.addMessage(`It is ${this.suspects[player]}'s turn`);
        if (this.isValidRoom(this.turnPlayerPosition) && this.turnPlayerLastPosition !== this.turnPlayerPosition) {
          this.turnPhase = this.phases.ROLL_OR_SUGGEST;
        } else {
          this.turnPhase = this.phases.ROLL;
        }
        if (this.isCpuPlayer(player)) {
          // let paths = {};
          // Object.keys(this.rooms).forEach(room => paths[room] = this.findShortestPathToRoom(room, this.cpuPlayers[player].coordinates));
          // console.log(paths);
          // let path = this.findShortestPathToRoom('lounge', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('hall', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('study', this.cpuPlayers[player].coordinates);
          let path = this.findShortestPathToRoom('library', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('billiard', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('conservatory', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('ballroom', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('kitchen', this.cpuPlayers[player].coordinates);
          // let path = this.findShortestPathToRoom('dining', this.cpuPlayers[player].coordinates);
          path.forEach(space => {
            if (!this.availableMovesOverride.hasOwnProperty(space.x)) {
              this.availableMovesOverride[space.x] = {};
            }
            this.availableMovesOverride[space.x][space.y] = true;
          });
          // console.log(path);
        }
      } else {
        this.endTurn();
      }
    },
    playerSelections: {
      handler (selected) {
        if (this.selectingPlayers) {
          Object.keys(this.playerCoordinates).forEach(player => this.playerCoordinates[player] = selected[player] !== playerTypes.DISABLED ? startingPositions[player] : null);
        }
      },
      deep: true
    },
    selectingPlayers (isSelecting) {
      if (!isSelecting) {
        let deck = shuffle(this.getRemainingDeckAfterPickingEnvelopeCards());
        this.dealCardsToPlayers(deck);
        this.turnOrder.forEach(player => {
          if (this.isCpuPlayer(player)) {
            this.cpuPlayers[player] = new CpuEasy(this.playerCards[player], this.playerCoordinates[player], this.turnOrder);
          }
        });
        this.currentTurn = 2;
      }
    },
    turnPhase (phase) {
      if (this.isRollPhase(phase)) {
        let canSuggest = this.isSuggestionPhase(this.turnPhase);
        let canPassage = this.isSecretPassageRoom(this.turnPlayerPosition);
        let msg = 'Roll the die';
        if (canSuggest && canPassage) {
          msg += ', make a suggestion, or take the secret passage';
        } else if (canSuggest) {
          msg += ', or make a suggestion';
        } else if (canPassage) {
          msg += ', or take the secret passage';
        }
        this.addMessage(msg);
      } else if (phase === this.phases.SUGGEST) {
        this.addMessage('Make a suggestion');
      }
    }
  },
  components: {
    Board,
    PlayerSelect,
    PlayerPanel
  }
};
</script>
