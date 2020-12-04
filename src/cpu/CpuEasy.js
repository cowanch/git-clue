import Cpu from '@/cpu/Cpu';
import { actions, notepadStates } from '@/specs/cpuSpecs';
import { phases } from '@/specs/turnSpecs';
import { roomNames } from '@/specs/roomSpecs';
import { deck } from '@/specs/cardSpecs';

class CpuEasy extends Cpu {
  startTurn (roomPaths, phase) {
    // Find the closest room that hasn't been disproven
    this.targetPath = null;
    let disprovenRooms = this.getRoomsOfState(notepadStates.DISPROVEN);
    // Filter out paths that are inaccessible and rooms that this player is already in
    let filteredRoomPaths = Object.keys(roomPaths).filter(room => roomPaths[room] !== undefined);
    if (filteredRoomPaths.length > 0) {
      // If there is only one path that is available (in the case that a corner room's door is blocked),
      // take it even if the other room is disproven
      if (filteredRoomPaths.length === 1) {
        this.targetPath = roomPaths[filteredRoomPaths[0]];
      } else {
        // Filter out paths to disproven rooms
        filteredRoomPaths = filteredRoomPaths.filter(room => !disprovenRooms.includes(room));
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
      } else if (phase === phases.ROLL_OR_SUGGEST &&
                 roomNames.includes(this.coordinates) &&
                 !this.getRoomsOfState(notepadStates.DISPROVEN).includes(this.coordinates)) {
        this.makeSuggestion();
        return {
          action: actions.SUGGEST,
          suggestion: this.suggestion
        };
      } else {
        return { action: actions.ROLL };
      }
    } else if (phase === phases.MOVE) {
      return {
        action: actions.MOVE,
        moveTo: this.chooseSpaceToMove()
      };
    } else if (phase === phases.SUGGEST) {
      if (roomNames.includes(this.coordinates)) {
        this.makeSuggestion();
        return {
          action: actions.SUGGEST,
          suggestion: this.suggestion
        };
      } else {
        return { action: actions.END };
      }
    } else if (phase === phases.END) {
      if (this.canAccuse()) {
        return {
          action: actions.ACCUSE,
          accusation: this.accusation
        };
      }
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

  chooseSuspectToSuggest () {
    let provenSuspects = this.getSuspectsOfState(notepadStates.PROVEN);
    if (provenSuspects === 1) {
      return provenSuspects[0];
    }
    let disprovenSuspects = this.getSuspectsOfState(notepadStates.DISPROVEN);
    let possibleSuspects = Object.keys(deck.suspects).filter(suspect => !disprovenSuspects.includes(suspect));
    let rand = Math.random() * possibleSuspects.length;
    return possibleSuspects[Math.floor(rand)];
  }

  chooseWeaponToSuggest () {
    let provenWeapons = this.getWeaponsOfState(notepadStates.PROVEN);
    if (provenWeapons === 1) {
      return provenWeapons[0];
    }
    let disprovenWeapons = this.getWeaponsOfState(notepadStates.DISPROVEN);
    let possibleWeapons = Object.keys(deck.weapons).filter(weapon => !disprovenWeapons.includes(weapon));
    let rand = Math.random() * possibleWeapons.length;
    return possibleWeapons[Math.floor(rand)];
  }

  chooseCardToReveal (cards) {
    let rand = Math.floor(Math.random() * cards.length);
    return cards[rand];
  }

  evaluateNotepad () {
    this.evaluateSuspects();
    this.evaluateWeapons();
    this.evaluateRooms();
  }

  evaluateSuspects () {
    let provenSuspects = this.getSuspectsOfState(notepadStates.PROVEN);
    if (provenSuspects === 1) {
      return;
    } else if (provenSuspects > 1) {
      // Should never have more than one proven suspect
      provenSuspects.forEach(suspect => this.resetNotepadState(suspect));
      this.accusation.suspect = '';
    }
    let disprovenSuspects = this.getSuspectsOfState(notepadStates.DISPROVEN);
    let possibleSuspects = Object.keys(deck.suspects).filter(suspect => !disprovenSuspects.includes(suspect));
    if (possibleSuspects.length === 1) {
      this.setNotepadState(this.myPlayer, possibleSuspects[0], notepadStates.PROVEN);
      this.accusation.suspect = possibleSuspects[0];
    }
  }

  evaluateWeapons () {
    let provenWeapons = this.getWeaponsOfState(notepadStates.PROVEN);
    if (provenWeapons === 1) {
      return;
    } else if (provenWeapons > 1) {
      // Should never have more than one proven weapon
      provenWeapons.forEach(weapon => this.resetNotepadState(weapon));
      this.accusation.weapon = '';
    }
    let disprovenWeapons = this.getWeaponsOfState(notepadStates.DISPROVEN);
    let possibleWeapons = Object.keys(deck.weapons).filter(weapon => !disprovenWeapons.includes(weapon));
    if (possibleWeapons.length === 1) {
      this.setNotepadState(this.myPlayer, possibleWeapons[0], notepadStates.PROVEN);
      this.accusation.weapon = possibleWeapons[0];
    }
  }

  evaluateRooms () {
    let provenRooms = this.getRoomsOfState(notepadStates.PROVEN);
    if (provenRooms === 1) {
      return;
    } else if (provenRooms > 1) {
      // Should never have more than one proven room
      provenRooms.forEach(room => this.resetNotepadState(room));
      this.accusation.room = '';
    }
    let disprovenRooms = this.getRoomsOfState(notepadStates.DISPROVEN);
    let possibleRooms = Object.keys(deck.rooms).filter(room => !disprovenRooms.includes(room));
    if (possibleRooms.length === 1) {
      this.setNotepadState(this.myPlayer, possibleRooms[0], notepadStates.PROVEN);
      this.accusation.room = possibleRooms[0];
    }
  }

  // Form a suggestion to be made
  makeSuggestion () {
    if (roomNames.includes(this.coordinates)) {
      this.suggestion.suspect = this.chooseSuspectToSuggest();
      this.suggestion.weapon = this.chooseWeaponToSuggest();
      this.suggestion.room = this.coordinates;
    }
  }

  // Record whether a player can disprove this player's suggestion, and check if the suggestion is proven
  recordPlayerCanDisprove (player, disproven) {
    this.playerCanDisprove[player] = disproven;
    if (this.isSuggestionProven()) {
      this.accusation.suspect = this.suggestion.suspect;
      this.accusation.weapon = this.suggestion.weapon;
      this.accusation.room = this.suggestion.room;
    }
  }
}

export default CpuEasy;
