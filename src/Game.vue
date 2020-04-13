<!--
  The main game component. Handles the game logic and components.
-->
<template>
  <div>
    <board/>
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
export default {
  name: 'Game',
  components: {
    Board
  }
};
</script>
