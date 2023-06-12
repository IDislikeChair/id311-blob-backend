import { Emcee } from './emcee.js';
import { GameFlowMgr } from './gameFlowMgr.js';
import { PlayerMgr } from './playerMgr.js';

export class AbstractMission {
  /**
   * @param {Emcee} emcee
   * @param {GameFlowMgr} gameFlowMgr
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, gameFlowMgr, playerMgr) {
    this.emcee = emcee;
    this.gameFlowMgr = gameFlowMgr;
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
