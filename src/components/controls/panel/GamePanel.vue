<template>
  <div class="css-game-panel">
    <die v-if="showDie"
         :value="dieValue"/>
    <div v-if="!optionsShown">
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
      <button v-if="showAccusationPrompt"
              @click="showAccusationOptions=true">
        Make Accusation
      </button>
    </div>
    <div v-else-if="showSuggestionOptions">
      <clue-options v-model="suggestion"
                    :room="playerRoom"/>
      <button @click="makeSuggestion"
              :disabled="!suggestionReady">
        Suggest
      </button>
    </div>
    <div v-else-if="showAccusationOptions">
      <clue-options v-model="accusation"/>
      <button @click="makeAccusation"
              :disabled="!accusationReady">
        Accuse
      </button>
      <button @click="showAccusationOptions=false">
        Cancel
      </button>
    </div>
    <card-display :cards="cardSelection"
                  :selection="true"
                  @card-selected="disprove"/>
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
    cardSelection: Array
  },
  data () {
    return {
      dieValue: 0,
      showSuggestionOptions: false,
      showAccusationOptions: false,
      suggestion: {
        suspect: '',
        weapon: ''
      },
      accusation: {
        suspect: '',
        weapon: '',
        room: ''
      },
      isDieRolling: false
    };
  },
  computed: {
    rollDisabled () {
      return !this.isRollPhase(this.turnPhase) || this.isDieRolling;
    },
    showDie () {
      return (this.isRollPhase(this.turnPhase) || this.turnPhase === this.phases.MOVE) && !this.optionsShown;
    },
    showSuggestionPrompt () {
      return this.isSuggestionPhase(this.turnPhase);
    },
    suggestionReady () {
      return this.suggestion.suspect && this.suggestion.weapon && this.playerRoom;
    },
    showAccusationPrompt () {
      return !this.rollDisabled || this.showSuggestionPrompt || this.showEndTurn;
    },
    accusationReady () {
      return this.accusation.suspect && this.accusation.weapon && this.accusation.room;
    },
    playerRoom () {
      return this.isValidRoom(this.playerPosition) ? this.playerPosition : '';
    },
    showEndTurn () {
      return this.turnPhase === this.phases.END;
    },
    optionsShown () {
      return this.showSuggestionOptions || this.showAccusationOptions;
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
    makeAccusation () {
      if (this.accusationReady) {
        this.$emit('accuse', this.accusation);
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
        this.suggestion.suspect = '';
        this.suggestion.weapon = '';
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
