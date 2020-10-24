/**
  Adds path finding algorithms for the game board
**/
import coordinates from '@/mixins/coordinates.mixin';

export default {
  mixins: [coordinates],
  data () {
    return {
      playerCoordinates: {}
    };
  },
  methods: {
    isValidPosition (position, path) {
      return this.isPositionOnBoard(position) && !this.isPositionOnPath(position, path) && !this.isPlayerOnPosition(position);
    },
    isPositionOnPath (position, path) {
      return path.some(pathPosition => this.coordinatesEqual(position, pathPosition));
    },
    isRoomOnPath (room, path) {
      return path.some(pathRoom => room === pathRoom);
    },
    isPlayerOnPosition (position) {
      return Object.values(this.playerCoordinates).filter(playerPosition => playerPosition !== null)
                                                  .some(playerPosition => this.coordinatesEqual(position, playerPosition));
    },
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
      if (this.isValidPosition(position, path)) {
        let newPath = path.slice();
        newPath.push(position);
        this.addNextMove(position, newPath, remaining-1, availableMoves);
      }
    },
    checkSecretPassages (position) {
      let availablePassage = {};
      let room = this.getSecretPassageRoom(position);
      if (room) {
        availablePassage[`passage-${room}`] = true;
      }
      return availablePassage;
    },
    // Start with a position and a target room
    findShortestPathToRoom (start, room) {
      return this.findNextSpaceToTarget(start, room, []);
    },
    findShortestPathToRoomFromRoom (startRoom, room) {
      if (startRoom === room) {
        return [];
      }
      let startingDoors = this.doorSpaces[startRoom].filter(space => this.isValidPosition(space, []));
      let start;
      let lowest = 0;
      startingDoors.forEach(door => {
        let target = this.findClosestDoorSpace(door, room);
        let numSpaces = this.findSpacesBetween(door, target);
        if (!start || numSpaces < lowest) {
          start = door;
          lowest = numSpaces;
        }
      });
      return this.findShortestPathToRoom(start, room);
    },
    findNextSpaceToTarget (position, room, path) {
      // Find the current closest door
      path.push(position);
      // console.log(position);
      let targetSpace = this.findClosestDoorSpace(position, room);
      // If the target space is the same as this position, we have reached the end of the path
      if (this.coordinatesEqual(position, targetSpace)) {
        return path;
      } else {
        let nextSpace = this.findSpaceInUnbrokenPath(position, targetSpace, path);
        if (!nextSpace) {
          // Need to find a detour
          let detour = this.findDetourSpace(position, targetSpace, path);
          if (!detour) {
            return path;
          }
          let neighbours = this.getSpaceNeighbours(position);
          let lowest = 0;
          neighbours.forEach(space => {
            if (this.isValidPosition(space, path)) {
              let distance = this.findDistanceBetween(space, detour);
              if (!nextSpace || distance < lowest) {
                nextSpace = space;
                lowest = distance;
              }
            }
          });
        }
        return this.findNextSpaceToTarget(nextSpace, room, path);
      }
    },
    findClosestDoorSpace (position, room) {
      let lowest = 0;
      let closestSpace = null;
      this.doorSpaces[room].forEach(space => {
        let spaces = this.findSpacesBetween(position, space);
        if (!closestSpace || spaces < lowest) {
          closestSpace = space;
          lowest = spaces;
        }
      });
      return closestSpace;
    },
    findSpaceInUnbrokenPath (start, target, path) {
      // Make sure these aren't the same space
      if (this.coordinatesEqual(start, target)) {
        return target;
      }

      let { x, y } = start;
      if (start.x !== target.x) {
        x += ((start.x < target.x) ? 1 : -1);
      }
      if (start.y !== target.y) {
        y += ((start.y < target.y) ? 1 : -1);
      }
      let nextX = { x: x, y: start.y };
      let nextY = { x: start.x, y: y };

      // Check if can traverse x then y
      let xThenY = false;
      let directXPath = this.canDirectTraverseX(start, target, path);
      if (!directXPath && this.canTraverseX(start, target, path)) {
        xThenY = this.canDirectTraverseY({ x: target.x, y: start.y }, target, path);
      }
      // Check if can traverse y then x
      let yThenX = false;
      let directYPath = this.canDirectTraverseY(start, target, path);
      if (!directYPath && this.canTraverseY(start, target, path)) {
        yThenX = this.canDirectTraverseX({ x: start.x, y: target.y }, target, path);
      }

      let nextSpaces = [];
      if (xThenY || directXPath) {
        nextSpaces.push(nextX);
      }
      if (yThenX || directYPath) {
        nextSpaces.push(nextY);
      }
      if (nextSpaces.length > 0) {
        let rand = Math.floor(Math.random() * nextSpaces.length);
        return nextSpaces[rand];
      }
      return null;
    },
    canTraverseX (start, target, path) {
      if (target.x === start.x) {
        // This space is already traversed
        return false;
      }
      let direction = start.x < target.x ? 1 : -1;
      for (let x=start.x+direction; x!==target.x; x+=direction) {
        let position = { x: x, y: start.y };
        if (!this.isValidPosition(position, path)) {
          return false;
        }
      }
      // Finally check the final space on this path
      return this.isValidPosition({ x: target.x, y: start.y }, path);
    },
    canDirectTraverseX (start, target, path) {
      let canTraverseX = this.canTraverseX(start, target, path);
      if (canTraverseX) {
        return this.coordinatesEqual({ x: target.x, y: start.y }, target);
      }
      return false;
    },
    canTraverseY (start, target, path) {
      if (target.y === start.y) {
        // This space is already traversed
        return false;
      }
      let direction = start.y < target.y ? 1 : -1;
      for (let y=start.y+direction; y!==target.y; y+=direction) {
        let position = { x: start.x, y: y };
        if (!this.isValidPosition(position, path)) {
          return false;
        }
      }
      // Finally check the final space on this path
      return this.isValidPosition({ x: start.x, y: target.y }, path);
    },
    canDirectTraverseY (start, target, path) {
      let canTraverseY = this.canTraverseY(start, target, path);
      if (canTraverseY) {
        return this.coordinatesEqual({ x: start.x, y: target.y }, target);
      }
      return false;
    },
    findDetourSpace (start, target, path) {
      // Find the midpoint
      let mid = this.getMidpoint(start, target);
      let m1 = (start.y - target.y) / (start.x - target.x);
      let m2 = (m1 === 0) ? 0 : -1 / m1;
      let b2 = mid.y - (m2 * mid.x);
      // With the perpendicular line, find the closest valid space
      let x = Math.floor(mid.x);
      for (let delta=0; delta<10; delta+=0.1) {
        let detours = [];

        let x1 = x + delta;
        let detour1 = { x: Math.floor(x1), y: Math.floor((m2*(x1))+b2) };
        if (this.isValidPosition(detour1, path)) {
          detours.push(detour1);
        }

        let x2 = x - delta;
        let detour2 = { x: Math.floor(x2), y: Math.floor((m2*(x2))+b2) };
        if (this.isValidPosition(detour2, path)) {
          detours.push(detour2);
        }

        if (detours.length > 0) {
          let rand = Math.floor(Math.random() * detours.length);
          return detours[rand];
        }
      }
      return null;
    },
    getSpaceNeighbours (position) {
      let { x, y } = position;
      let neighbours = [];
      neighbours.push({ x: x, y: y-1 });
      neighbours.push({ x: x, y: y+1 });
      neighbours.push({ x: x-1, y: y });
      neighbours.push({x: x+1, y: y});
      return neighbours;
    },
  }
}
