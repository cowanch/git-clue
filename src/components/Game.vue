<template>
  <div>
    <h1>Welcome to VueClue!</h1>
    <board/>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";

export default {
  name: "Game",
  components: {
    Board
  }
};
</script>

<style>
</style>
