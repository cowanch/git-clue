<template>
  <g>
    <!-- Miss Scarlet -->
    <circle v-if="scarlet && isCoordinates(scarlet)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(scarlet)"
            fill="red"/>
    <!-- Colonel Mustard -->
    <circle v-if="mustard && isCoordinates(mustard)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(mustard)"
            fill="yellow"/>
    <!-- Mrs. White -->
    <circle v-if="white && isCoordinates(white)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(white)"
            fill="white"/>
    <!-- Mr. Green -->
    <circle v-if="green && isCoordinates(green)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(green)"
            fill="green"/>
    <!-- Mrs. Peacock -->
    <circle v-if="peacock && isCoordinates(peacock)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(peacock)"
            fill="blue"/>
    <!-- Professor Plum -->
    <circle v-if="plum && isCoordinates(plum)"
            :cx="positionOffset" :cy="positionOffset" :r="tokenRadius"
            :transform="getCoordinatesTranslation(plum)"
            fill="purple"/>
  </g>
</template>

<style scoped>
circle {
  stroke: black;
}
</style>

<script>
import coordinates from '@/mixins/coordinates.mixin';

export default {
  name: 'PlayerTokens',
  mixins: [coordinates],
  data () {
    return {
      // Temporary data object - this will be passed in as a prop later
      coordinates: {
        scarlet: { x: 16, y: 0 },
        mustard: { x: 23, y: 7 },
        white: { x: 14, y: 24 },
        green: { x: 9, y: 24 },
        peacock: { x: 0, y: 18 },
        plum: { x: 0, y: 5 }
      }
    };
  },
  computed: {
    scarlet () {
      return this.coordinates.scarlet || null;
    },
    mustard () {
      return this.coordinates.mustard || null;
    },
    white () {
      return this.coordinates.white || null;
    },
    green () {
      return this.coordinates.green || null;
    },
    peacock () {
      return this.coordinates.peacock || null;
    },
    plum () {
      return this.coordinates.plum || null;
    },
    tokenRadius () {
      return this.cellSize / 3;
    },
    positionOffset () {
      return this.cellSize / 2;
    }
  }
};
</script>
