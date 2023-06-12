import { GameFlowMgr } from './gameFlowMgr.js';

export class AbstractMission {
  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    this.gameFlowMgr = gameFlowMgr;
    this.emcee = this.gameFlowMgr.get_session().get_emcee();
    this.playerMgr = this.gameFlowMgr.get_session().get_player_mgr();
  }

  wrap_up() {}
}
