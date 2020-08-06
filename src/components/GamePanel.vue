<template>
  <div>
    <die :value="dieValue"/>
  </div>
</template>

<script>
import Die from '@/components/Die';

export default {
  name: 'GamePanel',
  data () {
    return {
      dieValue: 1
    };
  },
  created () {
    this.increment();
  },
  methods: {
    increment () {
      this.dieValue++;
      this.dieValue = this.dieValue % 7;
      setTimeout(() => {
        this.increment();
      }, 3000);
    }
  },
  components: {
    Die
  }
};
</script>
