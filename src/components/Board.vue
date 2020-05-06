<!--
  The board model. This will keep track of spaces and rooms on the board, as well as rendering where each player is located
-->
<template>
  <svg height="100%" width="100%">
    <g :transform="`translate(${cellSize}, ${cellSize})`"
       :style="cssVars">
      <spaces v-bind="boardProps"/>
      <rooms v-bind="boardProps"/>
      <player-tokens v-bind="boardProps"/>
      <weapon-tokens v-bind="boardProps"/>
    </g>
  </svg>
</template>

<style>
rect, polygon, path {
  fill: white;
}

line, path {
  stroke: red;
  stroke-width: var(--border-width);
}

line.door, rect {
  stroke: black;
  stroke-width: var(--cell-line-width);
}

text {
  font-family: Helvetica, sans-serif;
  font-weight: bold;
  font-size: 20px;
  text-anchor: middle;
  dominant-baseline: middle
}
</style>

<script>
import Spaces from '@/components/Spaces';
import Rooms from '@/components/Rooms';
import PlayerTokens from '@/components/PlayerTokens';
import WeaponTokens from '@/components/WeaponTokens';

const CELL_SIZE = 35;
const CELL_LINE_WIDTH = 2;
const BORDER_WIDTH = 4;

export default {
  name: 'Board',
  computed: {
    boardProps () {
      return {
        cellSize: CELL_SIZE,
        cellLineWidth: CELL_LINE_WIDTH,
        borderWidth: BORDER_WIDTH
      };
    },
    cellSize () {
      return this.boardProps.cellSize;
    },
    cssVars () {
      return {
        '--cell-line-width': this.boardProps.cellLineWidth,
        '--border-width': this.boardProps.borderWidth
      };
    }
  },
  components: {
    Spaces,
    Rooms,
    PlayerTokens,
    WeaponTokens
  }
};
</script>
