import Cpu from '@/cpu/Cpu';
import { actions, notepadStates } from '@/specs/cpuSpecs';
import { phases } from '@/specs/turnSpecs';
import { roomNames } from '@/specs/roomSpecs';

class CpuEasy extends Cpu {
  startTurn (roomPaths, phase) {
    // Find the closest room that hasn't been disproven
    this.targetPath = null;
    console.log(roomPaths);
    let disprovedRooms = this.getRoomsOfState(notepadStates.DISPROVED);
    // Filter out paths that are inaccessible and rooms that this player is already in
    let filteredRoomPaths = Object.keys(roomPaths).filter(room => roomPaths[room] !== undefined);
    if (filteredRoomPaths.length > 0) {
      // If there is only one path that is available (in the case that a corner room's door is blocked),
      // take it even if the other room is disproved
      if (filteredRoomPaths.length === 1) {
        this.targetPath = roomPaths[filteredRoomPaths[0]];
      } else {
        // Filter out paths to disproven rooms
        filteredRoomPaths = filteredRoomPaths.filter(room => !disprovedRooms.includes(room));
        let closestRoom = filteredRoomPaths.reduce((closest, room) => {
          let closestSteps = roomPaths[closest].length;
          let steps = roomPaths[room].length;
          if (steps < closestSteps) {
            return room;
          } else if (steps === closestSteps) {
            // If the distance is the same, pick a room at random
            let rand = Math.floor(Math.random() * 2);
            return (rand < 1) ? room : closest;
          }
          return closest;
        });
        this.targetPath = roomPaths[closestRoom];
      }
    }
    return this.getNextMove(phase);
  }

  // This method will return what the next move for the player will be
  getNextMove (phase) {
    if (phase === phases.ROLL || phase === phases.ROLL_OR_SUGGEST) {
      if (this.targetPath === null) {
        if (phase === phases.ROLL) {
          return { action: actions.END };
        } else if (phase === phases.ROLL_OR_SUGGEST){
          // TODO: If can't move but can still suggest, make a suggestion
          return { action: actions.END };
        }
      } else if (roomNames.includes(this.targetPath[0]) && this.targetPath.length === 2) {
        return {
          action: actions.PASSAGE,
          moveTo: this.targetPath[1]
        };
      } else {
        return { action: actions.ROLL };
      }
    } else if (phase === phases.MOVE) {
      return {
        action: actions.MOVE,
        moveTo: this.chooseSpaceToMove()
      };
    } else {
      return { action: actions.END };
    }
  }

  chooseSpaceToMove () {
    // Go down as far as you can down the target path
    let selectedSpace = null;
    // The first space is the starting space, so exclude it
    // The most amount of spaces the player can go is 6
    this.targetPath.slice(1,7).forEach(space => {
      if (this.availableMoves.hasOwnProperty(space) ||
          this.availableMoves.hasOwnProperty(space.x) && this.availableMoves[space.x].hasOwnProperty(space.y)) {
        selectedSpace = space;
      }
    });
    return selectedSpace;
  }
}

export default CpuEasy;
