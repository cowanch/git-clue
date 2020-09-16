/**
  Adds common functionality for coordinates on the board
**/
export default {
  methods: {
    isCoordinates (obj) {
      return obj && obj.hasOwnProperty ? obj.hasOwnProperty('x') && obj.hasOwnProperty('y') : false;
    }
  }
};
