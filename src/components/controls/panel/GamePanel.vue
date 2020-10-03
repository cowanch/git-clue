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
        <button v-if="showEndTurn"
                @click="() => $emit('end-turn')">
          End Turn
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
      <card-display :cards="cardSelection"
                    :selection="true"
                    @card-selected="disprove"/>
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
import CardDisplay from '@/components/controls/panel/CardDisplay';
import rooms from '@/mixins/rooms.mixin';
import turnPhases from '@/mixins/turnPhases.mixin';

const ROLLS = 5;

export default {
  name: 'GamePanel',
  mixins: [rooms,turnPhases],
  props: {
    turnPhase: String,
    playerPosition: [String, Object],
    messages: Array,
    cardSelection: Array
  },
  data () {
    return {
      // dieValue: 0,
      dieValue: 1,
      showSuggestionOptions: false,
      suggestion: {
        suspect: '',
        weapon: ''
      },
      isDieRolling: false
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
      return !this.isRollPhase(this.turnPhase) || this.isDieRolling;
    },
    showDie () {
      return this.isRollPhase(this.turnPhase) || this.turnPhase === this.phases.MOVE;
    },
    showSuggestions () {
      return this.isSuggestionPhase(this.turnPhase);
    },
    showSuggestionPrompt () {
      return this.showSuggestions && !this.showSuggestionOptions;
    },
    suggestionReady () {
      return this.suggestion.suspect && this.suggestion.weapon && this.playerRoom;
    },
    playerRoom () {
      return this.isValidRoom(this.playerPosition) ? this.playerPosition : '';
    },
    showEndTurn () {
      return this.turnPhase === this.phases.END;
    }
  },
  methods: {
    rollDie () {
      this.isDieRolling = true;
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
        this.isDieRolling = false;
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
    },
    disprove (card) {
      this.$emit('disprove', card);
    }
  },
  watch: {
    turnPhase (phase) {
      if (this.isRollPhase(phase)) {
        this.dieValue = 0;
      }
      if (!this.isSuggestionPhase(phase)) {
        this.showSuggestionOptions = false;
      }
    },
    showSuggestionOptions (show) {
      this.$emit('show-suggest-options', show);
    }
  },
  components: {
    Die,
    ClueOptions,
    CardDisplay
  }
};
</script>
