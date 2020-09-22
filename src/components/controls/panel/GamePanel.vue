<template>
  <div>
    <!-- <template v-if="showDie"> -->
    <template>
      <die :value="dieValue"/>
      <div>
        <button @click="rollDie"
                :disabled="rollDisabled">
          Roll Die
        </button>
      </div>
    </template>
    <!-- <template v-else-if="showSuggestionSection"> -->
    <template>
      <div v-if="!showSuggestionOptions">
        <button @click="showSuggestionOptions=true">
          Make Suggestion
        </button>
        <button @click="endTurn">
          End Turn
        </button>
      </div>
      <suggestions v-model="suggestion"/>
      <button @click="makeSuggestion"
              :disabled="!suggestionReady">
        Suggest
      </button>
    </template>
  </div>
</template>

<style>
button {
  margin-right: 20px;
}
</style>

<script>
import Die from '@/components/pieces/Die';
import Suggestions from '@/components/controls/panel/Suggestions';
import {phases} from '@/specs/turnSpecs';

const ROLLS = 5;

export default {
  name: 'GamePanel',
  props: {
    turnPhase: String
  },
  data () {
    return {
      // dieValue: 0,
      dieValue: 1,
      showSuggestionOptions: false,
      suggestion: {
        suspect: '',
        weapon: '',
        room: ''
      }
    };
  },
  computed: {
    rollDisabled () {
      return this.turnPhase !== phases.ROLL;
    },
    showDie () {
      return this.turnPhase === phases.ROLL || this.turnPhase === phases.MOVE;
    },
    showSuggestionSection () {
      return this.turnPhase === phases.SUGGEST;
    },
    suggestionReady () {
      return this.suggestion.suspect && this.suggestion.weapon && this.suggestion.room;
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
    },
    endTurn () {
      this.$emit('end-turn');
    },
    makeSuggestion () {
      if (this.suggestionReady) {
        this.$emit('suggest', this.suggestion);
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
    Die,
    Suggestions
  }
};
</script>
