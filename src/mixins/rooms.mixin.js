/**
  Adds functions related to room information
**/
import { roomNames } from '@/specs/roomSpecs';

export default {
  methods: {
    isValidRoom (room) {
      return roomNames.includes(room);
    }
  }
};
