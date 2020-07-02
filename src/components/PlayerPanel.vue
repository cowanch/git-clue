<template>
  <div>
    <player-cards :cards="cards"/>
  </div>
</template>

<script>
import PlayerCards from '@/components/PlayerCards';

export default {
  name: 'PlayerPanel',
  props: {
    cards: Array
  },
  components: {
    PlayerCards
  }
};
</script>
