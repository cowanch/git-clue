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
                @die-rolled="roll => $emit('die-rolled', roll)"/>
    <notepad v-show="isTabOpen('notepad')"/>
    <player-cards v-show="isTabOpen('cards')"
                  :cards="cards"/>
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
</style>

<script>
import PlayerCards from '@/components/PlayerCards';
import Notepad from '@/components/Notepad';
import GamePanel from '@/components/GamePanel';

export default {
  name: 'PlayerPanel',
  props: {
    cards: Array
  },
  data () {
    return {
      openTab: 'cards'
    };
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
    PlayerCards,
    Notepad,
    GamePanel
  }
};
</script>
