<template>
  <g>
    <!-- Candlestick -->
    <use v-if="candlestick && isCoordinates(candlestick)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#candlestick"
         :transform="getCoordinatesTranslation(candlestick)"/>
    <!-- Knife -->
    <use v-if="knife && isCoordinates(knife)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#knife"
         :transform="getCoordinatesTranslation(knife)"/>
    <!-- Pipe -->
    <use v-if="pipe && isCoordinates(pipe)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#pipe"
         :transform="getCoordinatesTranslation(pipe)"/>
    <!-- Revolver -->
    <use v-if="revolver && isCoordinates(revolver)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#revolver"
         :transform="getCoordinatesTranslation(revolver)"/>
    <!-- Rope -->
    <use v-if="rope && isCoordinates(rope)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#rope"
         :transform="getCoordinatesTranslation(rope)"/>
    <!-- Wrench -->
    <use v-if="wrench && isCoordinates(wrench)"
         :width="tokenWidth"
         :height="tokenHeight"
         href="@/assets/tokens/weapons.svg#wrench"
         :transform="getCoordinatesTranslation(wrench)"/>
  </g>
</template>

<script>
import coordinates from '@/mixins/coordinates.mixin';

export default {
  name: 'WeaponTokens',
  mixins: [coordinates],
  data () {
    return {
      // Temporary data object - this will be passed in as a prop later
      coordinates: {
        candlestick: { x: 1, y: 21 },
        knife: { x: 18, y: 1 },
        pipe: { x: 22, y: 20 },
        revolver: { x: 22, y: 11 },
        rope: { x: 10, y: 1 },
        wrench: { x: 1, y: 1 }
      }
    };
  },
  computed: {
    tokenHeight () {
      return this.cellSize * 2;
    },
    tokenWidth () {
      return this.cellSize;
    },
    candlestick () {
      return this.coordinates.candlestick || null;
    },
    knife () {
      return this.coordinates.knife || null;
    },
    pipe () {
      return this.coordinates.pipe || null;
    },
    revolver () {
      return this.coordinates.revolver || null;
    },
    rope () {
      return this.coordinates.rope || null;
    },
    wrench () {
      return this.coordinates.wrench || null;
    }
  }
};
</script>
