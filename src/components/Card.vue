<template>
  <div class="css-card"
       :style="{width:widthPx, height:heightPx}">
    <p>Col. Mustard</p>
  </div>
</template>

<style scoped>
.css-card {
  border: 1px solid black;
  border-radius: 5px;
}
</style>

<script>
import {cardDimensions} from '@/specs/cardSpecs';

export default {
  name: 'Card',
  props: {
    size: {
      type: Number,
      default: 1
    }
  },
  computed: {
    widthPx () {
      return `${cardDimensions.width * this.size}px`;
    },
    heightPx () {
      return `${cardDimensions.height * this.size}px`;
    }
  }
};
</script>
