import { Player } from './player.js';

export class AbstractMission {
  constructor() {}

  /**
   * @returns {number}
   */
  get_duration() {
    throw new Error('Not implemented');
  }

  /**
   * @returns {function(Map<Player, Object>): Map<Player, boolean>}
   */
  get_result_resolver() {
    throw new Error('Not implemented');
  }
}
