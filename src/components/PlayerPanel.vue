<template>
  <div>
    <player-cards :cards="cards"/>
    <notepad/>
  </div>
</template>

<script>
import PlayerCards from '@/components/PlayerCards';
import Notepad from '@/components/Notepad';

export default {
  name: 'PlayerPanel',
  props: {
    cards: Array
  },
  components: {
    PlayerCards,
    Notepad
  }
};
</script>
