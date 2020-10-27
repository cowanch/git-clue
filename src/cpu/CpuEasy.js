import Cpu from '@/cpu/Cpu';
import { actions, notepadStates } from '@/specs/cpuSpecs';
import { phases } from '@/specs/turnSpecs';

class CpuEasy extends Cpu {
  startTurn (roomPaths, phase) {
    // Select what the player will do
    // Roll the die and move
    // Make a suggestion
    // Accuse
    // Take secret passage


    // Find the closest room that hasn't been disproven
    this.targetRoom = null;
    // console.log(roomPaths);
    let disprovedRooms = this.getRoomsOfState(notepadStates.DISPROVED);
    // console.log(disprovedRooms);
    let filteredRoomPaths = Object.keys(roomPaths).filter(room => {
      // Filter out paths that are inaccessible, rooms that this player is already in, and disproven rooms
      let path = roomPaths[room];
      return path !== undefined &&
             path.length > 0 &&
             !disprovedRooms.includes(room)
    });
    // console.log(filteredRoomPaths);
    let leastSteps = 0;
    let closestRoom = null;
    filteredRoomPaths.forEach(room => {
      let steps = roomPaths[room].length;
      if (closestRoom === null || steps < leastSteps) {
        closestRoom = room;
        leastSteps = steps;
      } else if (steps === leastSteps) {
        // If the distance is the same, pick a room at random
        let rand = Math.floor(Math.random() * 2);
        if (rand < 1) {
          closestRoom = room;
        }
      }
    });
    // console.log(closestRoom);
    // The first space is the starting space, so exclude it
    // The most amount of spaces the player can go is 6
    this.targetPath = roomPaths[closestRoom].slice(1, 7);
    return this.getNextMove(phase);
  }

  // This method will return what the next move for the player will be
  getNextMove (phase) {
    // For now, we will just cover the roll moves
    if (phase === phases.ROLL || phase === phases.ROLL_OR_SUGGEST) {
      return { action: actions.ROLL };
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
    this.targetPath.forEach(space => {
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
