import { Emcee } from './emcee.js';
import { PlayerMgr } from './playerMgr.js';

export class AbstractMission {
  /**
   * @param {Emcee} emcee
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, playerMgr) {
    this.emcee = emcee;
    this.playerMgr = playerMgr;
  }

  /**
   * @returns {number}
   */
  get_duration() {
    throw new Error('Not implemented');
  }

  run() {}
}
