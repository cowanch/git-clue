<template>
  <div class="css-game-panel">
    <template v-if="showDie">
    <!-- <template> -->
      <die :value="dieValue"/>
      <div>
        <button @click="rollDie"
                :disabled="rollDisabled">
          Roll Die
        </button>
      </div>
    </template>
    <template v-else-if="showSuggestionSection">
    <!-- <template> -->
      <div v-if="!showSuggestionOptions">
        <button @click="showSuggestionOptions=true">
          Make Suggestion
        </button>
        <button @click="endTurn">
          End Turn
        </button>
      </div>
      <div v-else>
        <clue-options v-model="suggestion"
                      :room="playerRoom"/>
        <button @click="makeSuggestion"
                :disabled="!suggestionReady">
          Suggest
        </button>
      </div>
    </template>
  </div>
</template>

<style>
.css-game-panel button {
  margin-right: 20px;
  margin-top: 20px;
}
</style>

<script>
import Die from '@/components/pieces/Die';
import ClueOptions from '@/components/controls/panel/ClueOptions';
import {phases} from '@/specs/turnSpecs';
import rooms from '@/mixins/rooms.mixin';

const ROLLS = 5;

export default {
  name: 'GamePanel',
  mixins: [rooms],
  props: {
    turnPhase: String,
    playerPosition: [String, Object]
  },
  data () {
    return {
      // dieValue: 0,
      dieValue: 1,
      showSuggestionOptions: false,
      suggestion: {
        suspect: '',
        weapon: ''
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
      return this.suggestion.suspect && this.suggestion.weapon && this.playerRoom;
    },
    playerRoom () {
      return this.isValidRoom(this.playerPosition) ? this.playerPosition : '';
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
        this.$emit('suggest', {
          suspect: this.suggestion.suspect,
          weapon: this.suggestion.weapon,
          room: this.playerRoom
        });
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
    ClueOptions
  }
};
</script>
