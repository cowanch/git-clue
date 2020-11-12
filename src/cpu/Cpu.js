import { deck } from '@/specs/cardSpecs';
import { notepadStates } from '@/specs/cpuSpecs';

class Cpu {
  constructor (myPlayer, cards, coords, players) {
    this.myPlayer = myPlayer;
    this.cards = cards;
    this.coordinates = coords;
    this.notepad = {};
    this.availableMoves = {};
    // Build the notepad for this player
    players.forEach(player => {
      this.notepad[player] = {};
      Object.keys(deck.suspects).forEach(suspect => this.notepad[player][suspect] = '');
      Object.keys(deck.weapons).forEach(weapon => this.notepad[player][weapon] = '');
      Object.keys(deck.rooms).forEach(room => this.notepad[player][room] = '');
    });
    // Mark each card as disproved in the notepad
    this.cards.forEach(card => this.setNotepadState(this.myPlayer, card, notepadStates.DISPROVED));
  }

  // Checks if the notepad contains the provided player and clue
  notepadContains (player, clue) {
    return this.notepad.hasOwnProperty(player) && this.notepad[player].hasOwnProperty(clue);
  }

  // Get the state in the notepad for the provided player and clue
  getNotepadState (player, clue) {
    if (this.notepadContains(player, clue)) {
      return this.notepad[player][clue];
    }
    return null;
  }

  // Sets the state in the notepad for the provided player and clue
  setNotepadState (player, clue, state) {
    if (this.notepadContains(player, clue)) {
      this.notepad[player][clue] = state;
    }
  }

  // Get a list of suspects that have the provided state across all players in the notepad
  getSuspectsOfState (player, state) {
    return Object.keys(deck.suspects).filter(suspect => Object.keys(this.notepad).some(player => this.getNotepadState(player, suspect) === state));
  }

  // Get a list of weapons that have the provided state across all players in the notepad
  getWeaponsOfState (player, state) {
    return Object.keys(deck.weapons).filter(weapon => Object.keys(this.notepad).some(player => this.getNotepadState(player, weapon) === state));
  }

  // Get a list of rooms that have the provided state across all players in the notepad
  getRoomsOfState (state) {
    return Object.keys(deck.rooms).filter(room => Object.keys(this.notepad).some(player => this.getNotepadState(player, room) === state));
  }

  setAvailableMoves (moves) {
    this.availableMoves = moves;
  }

  startRollPhase () {}
}

export default Cpu;
