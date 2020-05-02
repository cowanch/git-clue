<template>
  <g :transform="getXYTranslation(coordX, coordY)">
    <!-- top border -->
    <line x1="0" y1="0" :x2="cellSize" y2="0"
          v-if="borders.top"/>
    <!-- left border -->
    <line x1="0" y1="0" x2="0" :y2="cellSize"
          v-if="borders.left"/>
    <!-- bottom border -->
    <line x1="0" :y1="cellSize" :x2="cellSize" :y2="cellSize"
          v-if="borders.bottom"/>
    <!-- right border -->
    <line :x1="cellSize" y1="0" :x2="cellSize" :y2="cellSize"
          v-if="borders.right"/>
  </g>
</template>

<style scoped>
line {
  stroke: red;
  stroke-width: 4;
}
</style>

<script>
import coordinates from '@/mixins/coordinates.mixin';

export default {
  name: 'SpaceBorder',
  mixins: [coordinates],
  props: {
    coordX: Number,
    coordY: Number,
    borders: {
      type: Object,
      required: true
    }
  }
};
</script>
