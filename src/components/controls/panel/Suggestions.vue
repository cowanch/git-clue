<!--
  UI options to allow the player to suggest a suspect and weapon. Room is excluded here because the player cannot choose the
  suggested room (it is where the player is at the time)
-->
<template>
  <div class="css-suggestion-options">
    <!-- Suspect Suggestions -->
    <label for="suspectSuggestions">Suggest a suspect:</label>
    <select id="suspectSuggestions"
            v-model="selected.suspect">
      <option value="">--Select a Suspect--</option>
      <option v-for="(name, key) in suspects"
              :key="key"
              :value="key">
        {{name}}
      </option>
    </select>
    <!-- Weapon Suggestions -->
    <label for="weaponSuggestions">Suggest a weapon:</label>
    <select id="weaponSuggestions"
            v-model="selected.weapon">
      <option value="">--Select a Weapon--</option>
      <option v-for="(name, key) in weapons"
              :key="key"
              :value="key">
        {{name}}
      </option>
    </select>
  </div>
</template>

<style>
.css-suggestion-options {
  display: grid;
  grid-template-columns: auto auto;
  width: 30%;
}
select,label {
  margin-top: 10px;
}
</style>

<script>
import deck from '@/mixins/deck.mixin';

export default {
  name: 'Suggestions',
  mixins: [deck],
  props: {
    value: {
      type: Object,
      validator: (val) => val.hasOwnProperty('suspect') && val.hasOwnProperty('weapon')
    }
  },
  data () {
    return {
      selected: {
        suspect: '',
        weapon: ''
      }
    };
  },
  watch: {
    selected: {
      handler (val) {
        this.$emit('input', val);
      },
      deep: true
    },
    value (val) {
      if (val.suspect !== this.selected.suspect) {
        this.selected.suspect = val.suspect;
      }
      if (val.weapon !== this.selected.weapon) {
        this.selected.weapon = val.weapon;
      }
    }
  }
};
</script>
