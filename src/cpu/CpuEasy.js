import Cpu from '@/cpu/Cpu';
import { actions, notepadStates } from '@/specs/cpuSpecs';
import { phases } from '@/specs/turnSpecs';
import { roomNames } from '@/specs/roomSpecs';

class CpuEasy extends Cpu {
  startTurn (roomPaths, phase) {
    // Find the closest room that hasn't been disproven
    this.targetRoom = null;
    let disprovedRooms = this.getRoomsOfState(notepadStates.DISPROVED);
    let filteredRoomPaths = Object.keys(roomPaths).filter(room => {
      // Filter out paths that are inaccessible, rooms that this player is already in, and disproven rooms
      let path = roomPaths[room];
      return path !== undefined &&
             path.length > 0 &&
             !disprovedRooms.includes(room)
    });
    let closestRoom = filteredRoomPaths.reduce((closest, room) => {
      let steps = roomPaths[room].length;
      let closestSteps = roomPaths[closest].length;
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
    return this.getNextMove(phase);
  }

  // This method will return what the next move for the player will be
  getNextMove (phase) {
    // For now, we will just cover the roll moves
    if (phase === phases.ROLL || phase === phases.ROLL_OR_SUGGEST) {
      if (roomNames.includes(this.targetPath[0]) && this.targetPath.length === 2) {
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
    // console.log(this.targetPath);
    // console.log(this.availableMoves);
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
    // console.log(selectedSpace);
    return selectedSpace;
  }
}

export default CpuEasy;
