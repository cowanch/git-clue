<template>
  <div>
    <div class="css-game-panel">
      <die v-if="showDie"
           :value="dieValue"/>
      <div>
        <button v-if="showDie"
                @click="rollDie"
                :disabled="rollDisabled">
          Roll Die
        </button>
        <button v-if="showSuggestionPrompt"
                @click="showSuggestionOptions=true">
          Make Suggestion
        </button>
      </div>
      <div v-if="showSuggestionOptions">
        <clue-options v-model="suggestion"
                      :room="playerRoom"/>
        <button @click="makeSuggestion"
                :disabled="!suggestionReady">
          Suggest
        </button>
      </div>
    </div>
    <textarea readonly
              :value="messagesString"/>
  </div>
</template>

<style>
.css-game-panel button {
  margin-right: 20px;
  margin-top: 20px;
}
textarea {
  margin-top: 20px;
  width: 100%;
  height: 200px;
  resize: none;
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
    playerPosition: [String, Object],
    messages: Array
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
    messagesString () {
      let text = '';
      if (this.messages) {
        this.messages.forEach(str => text+=`${str}\n`);
      }
      return text;
    },
    rollDisabled () {
      return ![phases.ROLL, phases.ROLL_OR_SUGGEST].includes(this.turnPhase);
    },
    showDie () {
      return [phases.ROLL, phases.MOVE, phases.ROLL_OR_SUGGEST].includes(this.turnPhase);
    },
    showSuggestions () {
      return [phases.SUGGEST, phases.ROLL_OR_SUGGEST].includes(this.turnPhase);
    },
    showSuggestionPrompt () {
      return this.showSuggestions && !this.showSuggestionOptions;
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
    },
    showSuggestionOptions (show) {
      this.$emit('show-suggest-options', show);
    }
  },
  components: {
    Die,
    ClueOptions
  }
};
</script>
