<!--
  The board model. This will keep track of spaces and rooms on the board, as well as rendering where each player is located
-->
<template>
  <svg height="100%" width="100%">
    <spaces :cell-size="cellSize" />
    <player-tokens :cell-size="cellSize"/>
    <weapon-tokens :cell-size="cellSize"/>
  </svg>
</template>

<style>
rect {
  fill: white;
  stroke-width: 2;
  stroke: black;
}
rect.top {
  stroke-dasharray: 0,50,150;
}
</style>

<script>
import Spaces from '@/components/Spaces';
import PlayerTokens from '@/components/PlayerTokens';
import WeaponTokens from '@/components/WeaponTokens';

const CELL_SIZE = 35;

export default {
  name: 'Board',
  computed: {
    cellSize () {
      return CELL_SIZE;
    }
  },
  components: {
    Spaces,
    PlayerTokens,
    WeaponTokens
  }
};
</script>
