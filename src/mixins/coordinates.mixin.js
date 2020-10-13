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
    },
    getMidpoint (point1, point2) {
      if (this.isCoordinates(point1) && this.isCoordinates(point2)) {
        return {
          x: (point1.x + point2.x) / 2,
          y: (point1.y + point2.y) / 2
        };
      }
      return null;
    }
  }
};
