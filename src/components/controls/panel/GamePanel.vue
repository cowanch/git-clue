<template>
  <div>
    <die :value="dieValue"/>
    <button @click="rollDie">
      Roll Die
    </button>
  </div>
</template>

<script>
import Die from '@/components/pieces/Die';

const ROLLS = 5;

export default {
  name: 'GamePanel',
  data () {
    return {
      dieValue: 0
    };
  },
  methods: {
    rollDie () {
      this.generateRoll();
    },
    generateRoll (rollNumber = 0) {
      this.dieValue = Math.ceil(Math.random() * 6);
      if (rollNumber < ROLLS) {
        setTimeout(() => {
          this.generateRoll(rollNumber+1);
        }, 100);
      } else {
        this.$emit('die-rolled', this.dieValue);
      }
    }
  },
  components: {
    Die
  }
};
</script>
