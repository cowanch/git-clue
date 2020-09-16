/**
  Adds common functionality for cell size on the board
**/
const OFFSET_SCALE = 3/8;

import coordinates from '@/mixins/coordinates.mixin';

export default {
  mixins: [coordinates],
  props: {
    cellSize: Number
  },
  computed: {
    offsetScale () {
      return OFFSET_SCALE;
    }
  },
  methods: {
    getCoordinatesTranslation (coords) {
      return this.isCoordinates(coords) ? this.getXYTranslation(coords.x, coords.y) : '';
    },
    getXYTranslation (x, y) {
      return `translate(${this.cell(x)}, ${this.cell(y)})`;
    },
    offset(coord) {
      // A method to return an offset coordinate from a given board coordinate
      return (this.cellSize * this.offsetScale) + this.cell(coord);
    },
    cell(coord) {
      return this.cellSize * coord;
    }
  }
};
