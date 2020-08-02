<template>
  <table>
    <thead>
      <tr class="css-category-row">
        <th class="css-name-col">PLAYERS</th>
        <th v-for="(player, key) in notepad"
            :key="key"
            class="css-input-box">
          <input :placeholder="key"
                 v-model="player.name"/>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="css-category-row">
        <td colspan="7">SUSPECTS</td>
      </tr>
      <tr v-for="(name, key) in suspects"
          :key="key">
        <td class="css-name-col">{{name}}</td>
        <td v-for="(player, pkey) in notepad"
            :key="`${pkey}-${key}`"
            class="css-input-box">
          <input v-model="player[key]"/>
        </td>
      </tr>
      <tr class="css-category-row">
        <td colspan="7">WEAPONS</td>
      </tr>
      <tr v-for="(name, key) in weapons"
          :key="key">
        <td class="css-name-col">{{name}}</td>
        <td v-for="(player, pkey) in notepad"
            :key="`${pkey}-${key}`"
            class="css-input-box">
          <input v-model="player[key]"/>
        </td>
      </tr>
      <tr class="css-category-row">
        <td colspan="7">ROOMS</td>
      </tr>
      <tr v-for="(name, key) in rooms"
          :key="key">
        <td class="css-name-col">{{name}}</td>
        <td v-for="(player, pkey) in notepad"
            :key="`${pkey}-${key}`"
            class="css-input-box">
          <input v-model="player[key]"/>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table, td, th {
  border: 1px solid black;
  border-collapse: collapse;
}
th {
  text-align: left;
}
input {
  width: inherit;
  border: none;
  text-align: center;
  padding: inherit;
}
.css-name-col {
  width: 218px;
  padding: 2px 0px;
}
.css-category-row > td, th {
  font-size: 20px;
  padding: 5px 0px;
}
.css-input-box {
  width: 40px;
  text-align: center;
}
</style>

<script>
import {deck} from '@/specs/cardSpecs';

export default {
  name: 'Notepad',
  data () {
    return {
      notepad: {
        p1: {},
        p2: {},
        p3: {},
        p4: {},
        p5: {},
        p6: {}
      }
    };
  },
  computed: {
    suspects () {
      return deck.suspects;
    },
    weapons () {
      return deck.weapons;
    },
    rooms () {
      return deck.rooms;
    }
  },
  created () {
    Object.values(this.notepad).forEach(player => {
      this.$set(player, 'name', '');
      Object.keys(this.suspects).forEach(suspect => {
        this.$set(player, suspect, '');
      });
      Object.keys(this.weapons).forEach(weapon => {
        this.$set(player, weapon, '');
      });
      Object.keys(this.rooms).forEach(room => {
        this.$set(player, room, '');
      });
    });
  }
};
</script>
