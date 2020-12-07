import { deck } from '@/specs/cardSpecs';
import { actions, notepadStates, clueStates } from '@/specs/cpuSpecs';
import { roomNames } from '@/specs/roomSpecs';

class Cpu {
  constructor (myPlayer, cards, coords, players) {
    this.myPlayer = myPlayer;
    this.myTurn = false;
    this.cards = cards;
    this.coordinates = coords;
    this.notepad = {};
    this.clueStates = {};
    this.availableMoves = {};
    this.targetPath = null;
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
    });
    // Build the clue states for all clues
    Object.keys(deck.suspects).forEach(suspect => this.clueStates[suspect] = '');
    Object.keys(deck.weapons).forEach(weapon => this.clueStates[weapon] = '');
    Object.keys(deck.rooms).forEach(room => this.clueStates[room] = '');
    // Mark each card as disproved in the notepad
    this.cards.forEach(card => this.setNotepadOwned(this.myPlayer, card));
    Object.keys(this.notepad[this.myPlayer])
      .filter(clue => this.getNotepadState(this.myPlayer, clue) !== notepadStates.OWNED)
      .forEach(clue => this.setNotepadNotOwned(this.myPlayer, clue));
  }

  // ========== NOTEPAD FUNCTIONS ==========
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
      this.evaluateNotepad();
    }
  }

  // Reset a clue for all players
  resetNotepadState (clue) {
    Object.keys(this.notepad).forEach(player => {
      if (this.notepadContains(player, clue)) {
        this.setNotepadState(player, clue, '');
      }
    });
  }

  // Set this player as owning this clue
  setNotepadOwned (player, card) {
    this.setNotepadState(player, card, notepadStates.OWNED);
  }

  // Set this player as not owning this clue
  setNotepadNotOwned (player, card) {
    this.setNotepadState(player, card, notepadStates.NOT_OWNED);
  }

  // Returns whether all players in the notepad do not own a particular clue
  doAllPlayersNotOwn (clue) {
    Object.keys(this.notepad).every(player => this.getNotepadState(player, clue) === notepadStates.NOT_OWNED);
  }

  // Given a list of clues, return a filtered list of clues in a certain notepad state
  findCluesOfNotepadState (clues, state) {
    return clues.filter(clue => Object.keys(this.notepad).some(player => this.getNotepadState(player, clue) === state));
  }

  // Given a list of clues, return a filtered list of clues that are NOT in a certain notepad state
  findCluesNotOfNotepadState (clues, state) {
    let cluesOfNotepadState = this.findCluesOfNotepadState(clues, state);
    return clues.filter(clue => !cluesOfNotepadState.includes(clue));
  }

  // Get the suspects that are recorded as a certain state
  getSuspectsOfNotepadState (state) {
    return this.findCluesOfNotepadState(Object.keys(deck.suspects), state);
  }

  // Get the suspects that are NOT recorded as a certain state
  getSuspectsNotOfNotepadState (state) {
    return this.findCluesNotOfNotepadState(Object.keys(deck.suspects), state);
  }

  // Get the suspects that are recorded as a certain state
  getWeaponsOfNotepadState (state) {
    return this.findCluesOfNotepadState(Object.keys(deck.weapons), state);
  }

  // Get the suspects that are NOT recorded as a certain state
  getWeaponsNotOfNotepadState (state) {
    return this.findCluesNotOfNotepadState(Object.keys(deck.weapons), state);
  }

  // Get the suspects that are recorded as a certain state
  getRoomsOfNotepadState (state) {
    return this.findCluesOfNotepadState(Object.keys(deck.rooms), state);
  }

  // Get the suspects that are NOT recorded as a certain state
  getRoomsNotOfNotepadState (state) {
    return this.findCluesNotOfNotepadState(Object.keys(deck.rooms), state);
  }
  // ====================

  // ========== CLUE STATE FUNCTIONS ==========
  // Checks if the provided clue is one that exists
  isValidClue (clue) {
    return this.clueStates.hasOwnProperty(clue);
  }

  //
  getClueState (clue) {
    if (this.isValidClue(clue)) {
      return this.clueStates[clue];
    }
    return null;
  }

  //
  setClueState (clue, state) {
    if (this.isValidClue(clue)) {
      this.clueStates[clue] = state;
      this.updateAccusation();
    }
  }

  // From a provided list of clues, find clues that are in a provided state
  findCluesOfClueState (clues, state) {
    return clues.filter(clue => this.getClueState(clue) === state);
  }

  // From a provided list of clues, find clues that are NOT in a provided state
  findCluesNotOfClueState (clues, state) {
    let cluesOfState = this.findCluesOfClueState(clues, state);
    return clues.filter(clue => !cluesOfState.includes(clue));
  }

  // Get a list of suspects that have the provided clue state
  getSuspectsOfClueState (state) {
    return this.findCluesOfClueState(Object.keys(deck.suspects), state);
  }

  // Get a list of suspects that do NOT have the provided clue state
  getSuspectsNotOfClueState (state) {
    return this.findCluesNotOfClueState(Object.keys(deck.suspects), state);
  }

  // Get a list of weapons that have the provided clue state
  getWeaponsOfClueState (state) {
    return this.findCluesOfClueState(Object.keys(deck.weapons), state);
  }

  // Get a list of weapons that do NOT have the provided clue state
  getWeaponsNotOfClueState (state) {
    return this.findCluesNotOfClueState(Object.keys(deck.weapons), state);
  }

  // Get a list of rooms that have the provided clue state
  getRoomsOfClueState (state) {
    return this.findCluesOfClueState(Object.keys(deck.rooms), state);
  }

  // Get a list of rooms that do NOT have the provided clue state
  getRoomsNotOfClueState (state) {
    return this.findCluesNotOfClueState(Object.keys(deck.rooms), state);
  }
  // ====================

  // Sets available moves from a die roll to help choose a space to move to
  setAvailableMoves (moves) {
    this.availableMoves = moves;
  }

  // Sets the current coordinates for this player to help with making suggestions
  setCoordinates (coords) {
    this.coordinates = coords;
  }

  // Record a revealed card on the notepad under the player who revealed it
  recordRevealedCard (player, card) {
    this.setNotepadOwned(player, card);
  }

  // Returns whether or not this player is ready to accuse
  canAccuse () {
    let { suspect, weapon, room } = this.accusation;
    return !!suspect && !!weapon && !!room;
  }

  checkDisprovenSuspects () {
    let possibleSuspects = this.getSuspectsNotOfClueState(clueStates.DISPROVEN);
    if (possibleSuspects.length === 1) {
      this.setClueState(possibleSuspects[0], clueStates.PROVEN);
    }
  }

  checkDisprovenWeapons () {
    let possibleWeapons = this.getWeaponsNotOfClueState(clueStates.DISPROVEN);
    if (possibleWeapons.length === 1) {
      this.setClueState(possibleWeapons[0], clueStates.PROVEN);
    }
  }

  checkDisprovenRooms () {
    let possibleRooms = this.getRoomsNotOfClueState(clueStates.DISPROVEN);
    if (possibleRooms.length === 1) {
      this.setClueState(possibleRooms[0], clueStates.PROVEN);
    }
  }

  updateAccusation () {
    let provenSuspects = this.getSuspectsOfClueState(clueStates.PROVEN);
    if (provenSuspects.length === 1) {
      this.accusation.suspect = provenSuspects[0];
    }
    let provenWeapons = this.getWeaponsOfClueState(clueStates.PROVEN);
    if (provenWeapons.length === 1) {
      this.accusation.weapon = provenWeapons[0];
    }
    let provenRooms = this.getRoomsOfClueState(clueStates.PROVEN);
    if (provenRooms.length === 1) {
      this.accusation.room = provenRooms[0];
    }
  }

  // Make a suggestion for the suggest action
  makeSuggestion () {
    if (roomNames.includes(this.coordinates)) {
      return {
        suspect: this.chooseSuspectToSuggest(),
        weapon: this.chooseWeaponToSuggest(),
        room: this.coordinates
      };
    }
    return null;
  }

  // ========== ACTION FUNCTIONS ==========
  rollAction () {
    return { action: actions.ROLL };
  }

  passageAction (moveTo) {
    return {
      action: actions.PASSAGE,
      moveTo: moveTo
    };
  }

  moveAction () {
    return {
      action: actions.MOVE,
      moveTo: this.chooseSpaceToMove()
    };
  }

  suggestAction () {
    return {
      action: actions.SUGGEST,
      suggestion: this.makeSuggestion()
    };
  }

  accuseAction () {
    return {
      action: actions.ACCUSE,
      accusation: this.accusation
    };
  }

  endTurnAction () {
    this.myTurn = false;
    return { action: actions.END };
  }
  // ====================

  // ========== OVERRIDE FUNCTIONS ==========
  // The function that will call at the start of this player's turn
  startTurn () {
    this.myTurn = true;
  }

  // Get the next move based on the current phase
  getNextMove () {}

  // Choose a space to move for the move action
  chooseSpaceToMove () {}

  // Choose a suspect to suggest for the suggest action
  chooseSuspectToSuggest () {}

  // Choose a weapon to suggest for the suggest action
  chooseWeaponToSuggest () {}

  // Choose one of this player's cards to reveal
  chooseCardToReveal () {}

  // CPU players can witness when another player does or does not disprove a suggestion
  witnessDisproval () {}

  // Check to see if any entries can be considered proven yet
  evaluateNotepad () {}
  // ====================
}

export default Cpu;
