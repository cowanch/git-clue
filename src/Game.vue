<!--
  The main game component. Handles the game logic and components.
-->
<template>
  <board/>
</template>

<style>
html,
body,
body > div {
  height: 100%;
}
</style>

<script>
import Board from '@/components/Board.vue';
export default {
  name: 'Game',
  components: {
    Board
  }
};
</script>
