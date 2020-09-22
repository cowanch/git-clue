/**
  Adds common functionality for cards in the deck of clue cards
**/
import { deck } from '@/specs/cardSpecs';

export default {
  computed: {
    suspects () {
      return deck.suspects;
    },
    weapons () {
      return deck.weapons;
    },
    rooms () {
      return deck.rooms;
    }
  }
};
