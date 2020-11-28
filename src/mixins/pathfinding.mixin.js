/**
  Adds path finding algorithms for the game board
**/
import gridMap from '@/mixins/gridMap.mixin';
import coordinates from '@/mixins/coordinates.mixin';
import rooms from '@/mixins/rooms.mixin';

export default {
  mixins: [gridMap, coordinates, rooms],
  data () {
    return {
      playerCoordinates: {}
    };
  },
  methods: {
    // Checks if the passed in position can be traversed on
    isValidPosition (position, path) {
      // A move can be traversed if
      // - it exists in the grid map
      // - another token is not occupying it
      // - the move position does not exist in the path
      return this.isPositionAvailable(position) && !this.isPositionOnPath(position, path);
    },
    // Checks if a provided position is on the board and unoccupied
    isPositionAvailable (position) {
      return this.isPositionOnBoard(position) && !this.isPlayerOnPosition(position);
    },
    // Checks if the passed in position is in the passed in path
    isPositionOnPath (position, path) {
      return path.some(pathPosition => this.coordinatesEqual(position, pathPosition));
    },
    // Checks if the passed in room is in the passed in path
    isRoomOnPath (room, path) {
      return path.some(pathRoom => room === pathRoom);
    },
    // Checks if a player currently occupies the passed in position
    isPlayerOnPosition (position) {
      return Object.values(this.playerCoordinates).filter(playerPosition => playerPosition !== null)
                                                  .some(playerPosition => this.coordinatesEqual(position, playerPosition));
    },
    // Given a starting position and a number of moves, get a list of coordinates that can be landed on
    findAvailableMoves (start, moves) {
      let pathStart = [];
      let positions = [];
      let remaining = moves;
      // If the player is in a room, they can have multiple starting points
      if (this.doorSpaces.hasOwnProperty(start)) {
        pathStart.push(start);
        positions = this.doorSpaces[start];
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
    // Checks remaining moves, and if any are remaining, continue along each direction
    // Otherwise, add the current position as an available move
    addNextMove (position, path, remaining, availableMoves) {
      if (remaining === 0) {
        // End of our recursive chain
        let { x, y } = position;
        if (!availableMoves.hasOwnProperty(x)) {
          availableMoves[x] = {};
        }
        availableMoves[x][y] = true;
      } else {
        // Neighbours
        this.getSpaceNeighbours(position).forEach(neighbour => {
          this.findAvailableMoveFromPosition(neighbour, path, remaining, availableMoves);
        });
        // Rooms
        // If this room has a door to a room, that room is available to enter
        let room = this.adjacentRoom(position);
        if (room && !this.isRoomOnPath(room, path)) {
          availableMoves[room] = true;
        }
      }
    },
    // Checks the current position, and if valid, add the position to the path and move on to the next move
    findAvailableMoveFromPosition (position, path, remaining, availableMoves) {
      if (this.isValidPosition(position, path)) {
        let newPath = path.slice();
        newPath.push(position);
        this.addNextMove(position, newPath, remaining-1, availableMoves);
      }
    },
    // Checks for a secret passage on the passed in position, and returns it if there is one
    checkSecretPassages (position) {
      let availablePassage = {};
      let room = this.getSecretPassageRoom(position);
      if (room) {
        availablePassage[`passage-${room}`] = true;
      }
      return availablePassage;
    },
    // Finds the shortest path from a position to a room
    findShortestPathToRoom (start, room) {
      return this.findNextSpaceToTarget(start, room, []);
    },
    // Finds the shortest path from one room to another
    findShortestPathToRoomFromRoom (startRoom, room) {
      console.log(`===${room}===`);
      if (startRoom === room) {
        return undefined;
      }
      // Check for a trap door shortcut
      if (this.isSecretPassageRoom(startRoom)) {
        let secretPassageRoom = this.getSecretPassageRoom(startRoom);
        if (secretPassageRoom === room) {
          return [startRoom, secretPassageRoom];
        }
      }
      // Otherwise, find the nearest door space and start from there
      let startingDoors = this.doorSpaces[startRoom].filter(space => this.isPositionAvailable(space));

      while (startingDoors.length > 0) {
        let start = startingDoors.reduce((closest, door) => {
          let target1 = this.findClosestDoorSpace(closest, room);
          let numSpaces1 = this.findSpacesBetween(closest, target1);
          let target2 = this.findClosestDoorSpace(door, room);
          let numSpaces2 = this.findSpacesBetween(door, target2);
          return numSpaces2 < numSpaces1 ? door : closest;
        });
        console.log(`---------> door - ${start.x},${start.y}`);
        let pathToRoom = this.findNextSpaceToTarget(start, room, [startRoom]);
        if (pathToRoom !== undefined) {
          return pathToRoom;
        } else {
          // If a path cannot be made from the closest door, try the next closest
          startingDoors = startingDoors.filter(door => door !== start);
        }
      }
      // If no door space can be found, the room we are in is likely being blocked. Therefore no path can be made
      return undefined;
    },
    // Find the next space on the shortest path to a target room
    findNextSpaceToTarget (position, room, path) {
      // Find the current closest door
      path.push(position);
      console.log('PATHPATHPATH');
      console.log(path);
      // console.log(position);
      let doorSpace = this.findClosestDoorSpace(position, room);
      // If no door space can be found, the room we are going to is likely being blocked. Therefore no path can be made
      if (!doorSpace) {
        return undefined;
      }
      let targetSpace = doorSpace;
      // If the target space is the same as this position, we have reached the end of the path
      if (this.coordinatesEqual(position, targetSpace) || position === null) {
        path.push(room);
        return path;
      } else {
        let nextSpace = null;
        let seen = {};
        while (!nextSpace) {
          if (!targetSpace) {
            return undefined;
          } else {
            if (!seen.hasOwnProperty(targetSpace.x)) {
              seen[targetSpace.x] = {};
            }
            seen[targetSpace.x][targetSpace.y] = true;
          }
          nextSpace = this.findSpaceInUnbrokenPath(position, targetSpace, path, doorSpace);
          if (nextSpace && nextSpace.length === 2) {
            // Two equally close spaces, try them both
            for (let i=0; i<nextSpace.length; i++) {
              console.log(`nextPossibleSpace -> ${nextSpace[i].x},${nextSpace[i].y}`);
              let possiblePath = this.findNextSpaceToTarget(nextSpace[i], room, path.slice());
              if (possiblePath) {
                console.log('!!!!!!!!!!!!!!!!!!!!!!');
                console.log(possiblePath);
                return possiblePath;
              }
            }
            // Neither space could produce a viable path
            console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXX');
            nextSpace = null;
          }
          if (!nextSpace) {
            targetSpace = this.findDetourSpace(position, targetSpace, path, seen);
          }
        }
        console.log(`nextSpace -> ${nextSpace.x},${nextSpace.y}`);
        return this.findNextSpaceToTarget(nextSpace, room, path);
      }
    },
    // Given a position and a target room, find the door space with the least number of spaces to traverse
    // Sometimes a room will have more than one door, so knowing which door is closest can help build the shortest path
    findClosestDoorSpace (position, room) {
      let closestSpace = this.doorSpaces[room].reduce((closest, space) => {
        // If the number of spaces between is 0, this player is already on this door space
        let spaces1 = this.findSpacesBetween(position, closest);
        if (spaces1 === 0) {
          return closest;
        }
        let spaces2 = this.findSpacesBetween(position, space);
        if (spaces2 === 0) {
          return space;
        }
        // Return the available space that is closest (or null if neither space is available)
        if (this.isPositionAvailable(space) && spaces2 < spaces1) {
          return space;
        } else if (this.isPositionAvailable(closest)) {
          return closest;
        } else {
          return null;
        }
      });
      return this.isPositionAvailable(closestSpace) ? closestSpace : null;
    },
    // Try to find an unbroken path (horizontal then vertical or vice versa) and return the next space on that path
    findSpaceInUnbrokenPath (start, target, path, door) {
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
        if (nextSpaces.length === 2) {
          let spacesToDoor1 = this.findSpacesBetween(nextSpaces[0], door);
          let spacesToDoor2 = this.findSpacesBetween(nextSpaces[1], door);
          if (spacesToDoor1 < spacesToDoor2) {
            return nextSpaces[0];
          } else if (spacesToDoor2 < spacesToDoor1) {
            return nextSpaces[1];
          } else {
            // Return both, since one may not lead down a possible path
            return nextSpaces
          }
        }
        return nextSpaces[0];
      }
      return null;
    },
    // Returns true if you can move along the X coordinates to reach the same X value as the target position
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
    // Returns true if you can move along the X coordinates to reach the target position exactly
    canDirectTraverseX (start, target, path) {
      let canTraverseX = this.canTraverseX(start, target, path);
      if (canTraverseX) {
        return this.coordinatesEqual({ x: target.x, y: start.y }, target);
      }
      return false;
    },
    // Returns true if you can move along the Y coordinates to reach the same Y value as the target position
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
    // Returns true if you can move along the Y coordinates to reach the target position exactly
    canDirectTraverseY (start, target, path) {
      let canTraverseY = this.canTraverseY(start, target, path);
      if (canTraverseY) {
        return this.coordinatesEqual({ x: start.x, y: target.y }, target);
      }
      return false;
    },
    // Find the closest space on the board that is perpendicular to the direct line between the start and target positions
    findDetourSpace (start, target, path, seen) {
      // Find the midpoint
      let mid = this.getMidpoint(start, target);
      let m1 = (start.y - target.y) / (start.x - target.x);
      let m2 = (m1 === 0) ? undefined : -1 / m1;
      let b2 = mid.y - (m2 * mid.x);
      // let x = Math.floor(mid.x);
      // If the perpendicular slope is undefined, return the nearest space with the same x value

      let detours = [];

      let detour1 = this.findClosestMidSpace(mid, m2, b2, path, true);
      if (detour1) {
        console.log(`d1 - ${detour1.x},${detour1.y}`);
      }
      if (detour1 && (!seen[detour1.x] || !seen[detour1.x][detour1.y])) {
        detours.push(detour1);
      }

      let detour2 = this.findClosestMidSpace(mid, m2, b2, path, false);
      if (detour2) {
        console.log(`d2 - ${detour2.x},${detour2.y}`);
      }
      if (detour2 && (!seen[detour2.x] || !seen[detour2.x][detour2.y])) {
        detours.push(detour2);
      }


      if (detours.length > 0) {
        return detours.reduce((closest, detour) => {
          let numSpaces1 = this.findSpacesBetween(closest, mid);
          let numSpaces2 = this.findSpacesBetween(detour, mid);
          return numSpaces2 < numSpaces1 ? detour : closest;
        });
      }

      // if (m2 === undefined) {
      //   let y = Math.floor(mid.y);
      //   for (let delta=0; delta<10; delta++) {
      //     let detours = [];
      //
      //     let y1 = y + delta;
      //     let detour1 = { x: x, y: y1 };
      //     if (this.isValidPosition(detour1, path)) {
      //       detours.push(detour1);
      //     }
      //
      //     let y2 = y - delta;
      //     let detour2 = { x: x, y: y2 };
      //     if (this.isValidPosition(detour2, path)) {
      //       detours.push(detour2);
      //     }
      //
      //     if (detours.length > 0) {
      //       let rand = Math.floor(Math.random() * detours.length);
      //       let ret = detours[rand];
      //       return ret;
      //     }
      //   }
      // } else {
      //   let b2 = mid.y - (m2 * mid.x);
      //   // let detour1 = this.findClosestMidSpace()
      //   for (let delta=0; delta<10; delta+=0.1) {
      //     let detours = [];
      //     // let candidates = [];
      //
      //     let x1 = x + delta;
      //     let detour1 = { x: Math.floor(x1), y: Math.floor((m2 * x1) + b2) };
      //     // candidates.push(detour1);
      //     // console.log(detour1);
      //     if (this.isValidPosition(detour1, path)) {
      //       detours.push(detour1);
      //     }
      //
      //     let x2 = x - delta;
      //     let detour2 = { x: Math.floor(x2), y: Math.floor((m2 * x2) + b2) };
      //     // candidates.push(detour2);
      //     // console.log(detour2);
      //     if (this.isValidPosition(detour2, path)) {
      //       detours.push(detour2);
      //     }
      //
      //     // console.log('===============');
      //     // console.log(candidates);
      //     // console.log(detours);
      //     if (detours.length > 0) {
      //       let rand = Math.floor(Math.random() * detours.length);
      //       let ret = detours[rand];
      //       return ret;
      //     }
      //   }
      // }
      return null;
    },
    findClosestMidSpace (mid, m, b, path, positive) {
      let x = Math.floor(mid.x);
      for (let delta=0; delta<24; delta+=0.1) {
        let midSpace = null;
        if (m === undefined) {
          let dy = Math.floor(mid.y) + (delta * (positive ? 1 : -1));
          midSpace = { x: x, y: Math.floor(dy) };
          // console.log(`midspace -> ${midSpace.x},${midSpace.y}`);
        } else {
          let dx = x + (delta * (positive ? 1 : -1));
          midSpace = { x: Math.floor(dx), y: Math.floor((m * dx) + b) };
        }
        if (this.isValidPosition(midSpace, path)) {
          return midSpace;
        }
      }
      return null;
    },
    // Build a list of positions that are direct neighbours of the passed in position (does not check the board for validity)
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
