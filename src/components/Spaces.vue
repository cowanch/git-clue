<!--
  A component to hold all of the space squares to make it easier to debug the board
-->
<template>
  <g>
    <template v-for="(row, rowIdx) in layout">
      <template v-for="(cell) in row">
        <rect :width="cellSize"
              :height="cellSize"
              :key="`row-${rowIdx}-col-${cell.col}`"
              :transform="getXYTranslation(cell.col, rowIdx)"/>
        <space-border :key="`border-${rowIdx}-${cell.col}`"
                      :coordX="cell.col"
                      :coordY="rowIdx"
                      :borders="cell.borders"
                      :cellSize="cellSize"/>
      </template>
    </template>
  </g>
</template>

<script>
import coordinates from '@/mixins/coordinates.mixin';
import grid from '@/components/boardGrid.js'
import SpaceBorder from '@/components/SpaceBorder';

export default {
  name: 'Spaces',
  mixins: [coordinates],
  computed: {
    layout () {
      return grid;
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
