/**
 * @typedef {Object} PlayerStatus
 */
export const PlayerStatus = {
  IDLE: Symbol('IDLE'),
  PLAYING: Symbol('PLAYING'),
  UNKNOWN: Symbol('UNKNOWN'),
};

Object.freeze(PlayerStatus);
