<!--
  The main game component. Handles the game logic and components.
-->
<template>
  <div class="css-container">
    <board :token-coordinates="tokenCoordinates"
           :available-moves="availableMoves"/>
    <div class="css-options">
      <player-select v-if="selectingPlayers"
                     v-model="playerSelections"
                     @finish="selectingPlayers=false"/>
      <player-panel v-else
                    :cards="playerCards[turnPlayer]"
                    @die-rolled="setDieRoll"/>
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
import playerPositions from '@/specs/startingPositions';
import grid from '@/specs/boardSpecs';
import {deck} from '@/specs/cardSpecs';
// Utils
import shuffle from '@/utils/shuffle';

export default {
  name: 'Game',
  data () {
    return {
      playerCoordinates: {
        scarlet: null,
        mustard: null,
        white: null,
        green: null,
        peacock: null,
        plum: null
      },
      weaponCoordinates: {
        candlestick: 'conservatory',
        knife: 'lounge',
        pipe: 'kitchen',
        revolver: 'dining',
        rope: 'hall',
        wrench: 'study'
      },
      playerSelections: {
        scarlet: 'disabled',
        mustard: 'disabled',
        white: 'disabled',
        green: 'disabled',
        peacock: 'disabled',
        plum: 'disabled'
      },
      currentTurn: -1,
      dieRoll: 0,
      selectingPlayers: true,
      envelope: {},
      playerCards: {
        scarlet: [],
        mustard: [],
        white: [],
        green: [],
        peacock: [],
        plum: []
      }
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
    availableMoves () {
      let availableMoves = {};
      if (this.dieRoll > 0) {
        let player = this.turnOrder[this.currentTurn];
        if (this.playerCoordinates.hasOwnProperty(player)) {
          availableMoves = this.findAvailableMoves(this.playerCoordinates[player], this.dieRoll);
        }
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
    }
  },
  created () {
    this.currentTurn = 0;
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
    getRemainingDeckAfterPickingEnvelopeCards () {
      let suspectDeck = shuffle(Object.keys(deck.suspects));
      let weaponDeck = shuffle(Object.keys(deck.weapons));
      let roomDeck = shuffle(Object.keys(deck.rooms));
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
    setDieRoll (roll) {
      this.dieRoll = roll;
    }
  },
  watch: {
    currentTurn (turn) {
      if (turn > this.turnOrder.length-1) {
        turn = 0;
      } else if (turn < 0) {
        turn = this.turnOrder.length-1;
      }
    },
    playerSelections: {
      handler (selected) {
        if (this.selectingPlayers) {
          Object.keys(this.playerCoordinates).forEach(player => this.playerCoordinates[player] = selected[player] !== 'disabled' ? playerPositions[player] : null);
        }
      },
      deep: true
    },
    selectingPlayers (isSelecting) {
      if (!isSelecting) {
        let deck = shuffle(this.getRemainingDeckAfterPickingEnvelopeCards());
        this.dealCardsToPlayers(deck);
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
