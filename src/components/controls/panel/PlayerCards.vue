<template>
  <div class="css-panel">
    <card v-for="(card) in cards"
          :key="card"
          class="css-card"
          :size="cardScale"
          :id="card"/>
  </div>
</template>

<style scoped>
.css-panel {
  background: lightgray;
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}
.css-card {
  margin: 10px 10px;
}
</style>

<script>
import Card from '@/components/pieces/Card';

export default {
  name: 'PlayerCards',
  props: {
    cards: Array
  },
  data () {
    return {
      cardScale: 2
    };
  },
  components: {
    Card
  }
};
</script>
