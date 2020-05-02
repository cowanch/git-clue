/**
  Adds common functionality for coordinates on the board
**/
export default {
  props: {
    cellSize: Number
  },
  methods: {
    isCoordinates (obj) {
      return Object.prototype.hasOwnProperty.call(obj, 'x')
             && Object.prototype.hasOwnProperty.call(obj, 'y');
    },
    getCoordinatesTranslation (coords) {
      return this.isCoordinates(coords) ? this.getXYTranslation(coords.x, coords.y) : '';
    },
    getXYTranslation (x, y) {
      return `translate(${this.cellSize*x}, ${this.cellSize*y})`;
    }
  }
};
