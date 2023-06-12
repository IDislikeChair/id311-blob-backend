import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

export class MissionThree extends AbstractMission {
  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);
  }

  wrap_up() {}
}
