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
    this.playerCanDisprove = {};
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
        this.playerCanDisprove[player] = '';
      }
    });
    // Mark each card as disproved in the notepad
    this.cards.forEach(card => this.setNotepadState(this.myPlayer, card, notepadStates.DISPROVEN));
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

  // Sets available moves from a die roll to help choose a space to move to
  setAvailableMoves (moves) {
    this.availableMoves = moves;
  }

  // Sets the current coordinates for this player to help with making suggestions
  setCoordinates (coords) {
    this.coordinates = coords;
  }

  // The function that will call at the start of this player's turn
  startTurn () {}

  // Choose one of this player's cards to reveal
  chooseCardToReveal () {}

  // Record a revealed card on the notepad under the player who revealed it
  recordRevealedCard (player, card) {
    this.setNotepadState(player, card, notepadStates.DISPROVEN);
    this.evaluateNotepad();
  }

  // Records whether a player can or cannot disprove this player's suggestion
  recordPlayerCanDisprove () {}

  // Check to see if any entries can be considered proven yet
  evaluateNotepad () {}

  // Returns whether or not this player is ready to accuse
  canAccuse () {
    return !!this.accusation.suspect && !!this.accusation.weapon && !!this.accusation.room;
  }

  // Reset this player's suggestion and disproving players
  resetSuggestion () {
    this.suggestion.suspect = '';
    this.suggestion.weapon = '';
    this.suggestion.room = '';
    Object.keys(this.playerCanDisprove).forEach(player => {
      this.playerCanDisprove[player] = '';
    });
  }

  // Checks if all players were unable to disprove the suggestion
  isSuggestionProven () {
    return Object.values(this.playerCanDisprove).every(disproved => disproved === false);
  }
}

export default Cpu;
