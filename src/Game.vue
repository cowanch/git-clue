<!--
  The main game component. Handles the game logic and components.
-->
<template>
  <board :token-coordinates="tokenCoordinates"/>
</template>

<style>
html,
body,
body > div {
  height: 100%;
}
</style>

<script>
import Board from '@/components/Board.vue';
export default {
  name: 'Game',
  data () {
    return {
      playerCoordinates: {
        scarlet: { x: 16, y: 0 },
        mustard: { x: 23, y: 7 },
        white: { x: 14, y: 24 },
        green: { x: 9, y: 24 },
        peacock: { x: 0, y: 18 },
        plum: { x: 0, y: 5 }
      },
      weaponCoordinates: {
        candlestick: 'conservatory',
        knife: 'lounge',
        pipe: 'kitchen',
        revolver: 'dining',
        rope: 'hall',
        wrench: 'study'
      }
    };
  },
  computed: {
    tokenCoordinates () {
      return {
        players: this.playerCoordinates,
        weapons: this.weaponCoordinates
      }
    }
  },
  components: {
    Board
  }
};
</script>
