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
    getMidpoint (obj1, obj2) {
      if (this.isCoordinates(obj1) && this.isCoordinates(obj2)) {
        return {
          x: (obj1.x + obj2.x) / 2,
          y: (obj1.y + obj2.y) / 2
        };
      }
      return null;
    },
    findDistanceBetween (obj1, obj2) {
      if (this.isCoordinates(obj1) && this.isCoordinates(obj2)) {
        return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
      }
      return null;
    },
    findSpacesBetween (obj1, obj2) {
      if (this.isCoordinates(obj1) && this.isCoordinates(obj2)) {
        let hSpaces = Math.abs(obj1.x - obj2.x);
        let vSpaces = Math.abs(obj1.y - obj2.y);
        return hSpaces + vSpaces;
      }
      return null;
    }
  }
};
