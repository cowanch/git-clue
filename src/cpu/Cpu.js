import { deck } from '@/specs/cardSpecs';

class Cpu {
  constructor (cards, coords, players) {
    this.cards = cards;
    this.coordinates = coords;
    this.notepad = {};
    players.forEach(player => {
      this.notepad[player] = {};
      Object.keys(deck.suspects).forEach(suspect => {
        this.notepad[player][suspect] = '';
      });
      Object.keys(deck.weapons).forEach(weapon => {
        this.notepad[player][weapon] = '';
      });
      Object.keys(deck.rooms).forEach(room => {
        this.notepad[player][room] = '';
      });
    });
  }
}

export default Cpu;
