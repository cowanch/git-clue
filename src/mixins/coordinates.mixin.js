/**
  Adds common functionality for coordinates on the board
**/
export default {
  methods: {
    isCoordinates (obj) {
      return obj && obj.hasOwnProperty ? obj.hasOwnProperty('x') && obj.hasOwnProperty('y') : false;
    },
    coordinatesEqual (obj1, obj2) {
      if (this.isCoordinates(obj1) && this.isCoordinates(obj2)) {
        return obj1.x === obj2.x && obj1.y === obj2.y;
      }
      return false;
    }
  }
};
