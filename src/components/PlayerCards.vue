<template>
  <div class="css-panel"
       :style="{width:widthPx, height:heightPx}">
    <card :size="cardScale"/>
    <card :size="cardScale" class="css-middle-card"/>
    <card :size="cardScale"/>
  </div>
</template>

<style scoped>
.css-panel {
  background: lightgray;
  display: flex;
  padding: 10px 10px;
}
.css-middle-card {
  margin: 0px 10px;
}
</style>

<script>
import Card from '@/components/Card';
import cardDimensions from '@/specs/cardSpecs';

export default {
  name: 'PlayerCards',
  data () {
    return {
      cardScale: 1
    };
  },
  computed: {
    heightPx () {
      return `${cardDimensions.height * this.cardScale}px`;
    },
    widthPx () {
      return `${((cardDimensions.width * this.cardScale) + 10) * 3}px`;
    }
  },
  components: {
    Card
  }
};
</script>
