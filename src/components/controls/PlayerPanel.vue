<template>
  <div>
    <div class="css-tab">
      <button :class="getActiveTabClass('game')"
              @click="setActiveTab('game')">
        Game
      </button>
      <button :class="getActiveTabClass('notepad')"
              @click="setActiveTab('notepad')">
        Notepad
      </button>
      <button :class="getActiveTabClass('cards')"
              @click="setActiveTab('cards')">
        Cards
      </button>
    </div>
    <game-panel v-show="isTabOpen('game')"
                class="css-panel"
                :turn-phase="turnPhase"
                :player-position="playerPosition"
                :card-selection="cardSelection"
                @disprove="card => $emit('disprove', card)"
                @die-rolled="roll => $emit('die-rolled', roll)"
                @end-turn="() => $emit('end-turn')"
                @show-suggest-options="show => $emit('show-suggest-options', show)"
                @suggest="suggestion => $emit('suggest', suggestion)"/>
    <notepad v-show="isTabOpen('notepad')"
             class="css-panel"/>
    <card-display v-show="isTabOpen('cards')"
                  :cards="cards"/>
    <textarea readonly
              :value="messagesString"/>
  </div>
</template>

<style scoped>
.css-tab {
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}
/* Style the buttons that are used to open the tab content */
.css-tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: 0.3s;
}
/* Change background color of buttons on hover */
.css-tab button:hover {
  background-color: #ddd;
}
/* Create an active/current tablink class */
.css-tab button.active {
  background-color: #ccc;
}
.css-panel {
  margin-top: 20px;
}
</style>

<script>
import CardDisplay from '@/components/controls/panel/CardDisplay';
import Notepad from '@/components/controls/panel/Notepad';
import GamePanel from '@/components/controls/panel/GamePanel';

export default {
  name: 'PlayerPanel',
  props: {
    cards: Array,
    cardSelection: Array,
    turnPhase: String,
    playerPosition: [String, Object],
    messages: Array
  },
  data () {
    return {
      openTab: 'cards'
    };
  },
  computed: {
    messagesString () {
      let text = '';
      if (this.messages) {
        this.messages.forEach(str => text+=`${str}\n`);
      }
      return text;
    }
  },
  methods: {
    setActiveTab (id) {
      this.openTab = id;
    },
    getActiveTabClass (id) {
      return {
        'active': this.isTabOpen(id)
      };
    },
    isTabOpen (id) {
      return this.openTab === id;
    }
  },
  components: {
    CardDisplay,
    Notepad,
    GamePanel
  }
};
</script>
