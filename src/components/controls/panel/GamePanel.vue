<template>
  <div>
    <die :value="dieValue"/>
    <button @click="rollDie"
            :disabled="rollDisabled">
      Roll Die
    </button>
  </div>
</template>

<script>
import Die from '@/components/pieces/Die';
import {phases} from '@/specs/turnSpecs';

const ROLLS = 5;

export default {
  name: 'GamePanel',
  props: {
    turnPhase: String
  },
  data () {
    return {
      dieValue: 0
    };
  },
  computed: {
    rollDisabled () {
      return this.turnPhase !== phases.ROLL;
    }
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
  watch: {
    turnPhase (phase) {
      if (phase === phases.ROLL) {
        this.dieValue = 0;
      }
    }
  },
  components: {
    Die
  }
};
</script>
