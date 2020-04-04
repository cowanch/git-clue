<!--
  The board model. This will keep track of spaces and rooms on the board, as well as rendering where each player is located
-->
<template>
  <div>
    <svg :height="`${cellSize*numRows}px`" width="100%">
      <template v-for="(row, rowIdx) in layout">
        <template v-for="(cell) in row">
          <rect :width="cellSize"
                :height="cellSize"
                :key="`row-${rowIdx}-col-${cell.col}`"
                :transform="`translate(${cellSize*cell.col}, ${(cellSize*rowIdx)})`"/>
          <space-border :key="`border-${rowIdx}-${cell.col}`"
                        :coordX="cell.col"
                        :coordY="rowIdx"
                        :borders="cell.borders"
                        :cellSize="cellSize"/>
        </template>
      </template>
    </svg>
  </div>
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
import grid from '@/components/boardGrid.js'
import SpaceBorder from '@/components/SpaceBorder';
const CELL_SIZE = 30;
export default {
  name: 'Board',
  computed: {
    layout () {
      return grid;
    },
    cellSize () {
      return CELL_SIZE;
    },
    numRows () {
      return grid.length;
    }
  },
  components: {
    SpaceBorder
  }
};
</script>
