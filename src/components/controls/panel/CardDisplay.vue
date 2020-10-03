<template>
  <div class="css-player-cards">
    <card v-for="(card) in cards"
          :key="card"
          class="css-card"
          :class="{'css-hover':selection}"
          :size="cardScale"
          :id="card"
          @click="() => emitCardSelected(card)"/>
  </div>
</template>

<style scoped>
.css-player-cards {
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}
.css-card {
  margin: 10px 10px;
}
.css-hover {
  cursor: pointer;
}
</style>

<script>
import Card from '@/components/pieces/Card';

export default {
  name: 'CardDisplay',
  props: {
    cards: Array,
    selection: Boolean
  },
  data () {
    return {
      cardScale: 2
    };
  },
  methods: {
    emitCardSelected (card) {
      this.$emit('card-selected', card);
    }
  },
  components: {
    Card
  }
};
</script>
