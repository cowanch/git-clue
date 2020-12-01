import { deck } from '@/specs/cardSpecs';
import { notepadStates } from '@/specs/cpuSpecs';

class Cpu {
  constructor (myPlayer, cards, coords, players) {
    this.myPlayer = myPlayer;
    this.cards = cards;
    this.coordinates = coords;
    this.notepad = {};
    this.availableMoves = {};
    this.targetPath = null;
    this.roomPaths = null;
    this.suggestionDisproved = {};
    this.suggestion = {
      suspect: '',
      weapon: '',
      room: ''
    };
    this.accusation = {
      suspect: '',
      weapon: '',
      room: ''
    };
    // Build the notepad for this player
    players.forEach(player => {
      this.notepad[player] = {};
      Object.keys(deck.suspects).forEach(suspect => this.notepad[player][suspect] = '');
      Object.keys(deck.weapons).forEach(weapon => this.notepad[player][weapon] = '');
      Object.keys(deck.rooms).forEach(room => this.notepad[player][room] = '');
      if (player !== this.myPlayer) {
        this.suggestionDisproved[player] = '';
      }
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

  resetNotepadState (clue) {
    Object.keys(this.notepad).forEach(player => {
      if (this.notepadContains(player, clue)) {
        this.setNotepadState(player, clue, '');
      }
    });
  }

  // Get a list of suspects that have the provided state across all players in the notepad
  getSuspectsOfState (state) {
    return Object.keys(deck.suspects).filter(suspect => Object.keys(this.notepad).some(player => this.getNotepadState(player, suspect) === state));
  }

  // Get a list of weapons that have the provided state across all players in the notepad
  getWeaponsOfState (state) {
    return Object.keys(deck.weapons).filter(weapon => Object.keys(this.notepad).some(player => this.getNotepadState(player, weapon) === state));
  }

  // Get a list of rooms that have the provided state across all players in the notepad
  getRoomsOfState (state) {
    return Object.keys(deck.rooms).filter(room => Object.keys(this.notepad).some(player => this.getNotepadState(player, room) === state));
  }

  setAvailableMoves (moves) {
    this.availableMoves = moves;
  }

  setCoordinates (coords) {
    this.coordinates = coords;
  }

  startTurn () {}

  chooseCardToReveal () {}

  recordRevealedCard (player, card) {
    this.setNotepadState(player, card, notepadStates.DISPROVED);
    this.evaluateNotepad();
  }

  // Check to see if any entries can be considered proven yet
  evaluateNotepad () {}

  canAccuse () {
    return !!this.accusation.suspect && !!this.accusation.weapon && !!this.accusation.room;
  }

  recordDisproving () {}

  resetSuggestion () {
    this.suggestion.suspect = '';
    this.suggestion.weapon = '';
    this.suggestion.room = '';
    Object.keys(this.suggestionDisproved).forEach(player => {
      this.suggestionDisproved[player] = '';
    });
  }

  // Checks if all players were unable to disprove the suggestion
  checkSuggestionDisproved () {
    return Object.values(this.suggestionDisproved).every(disproved => disproved === false);
  }
}

export default Cpu;
