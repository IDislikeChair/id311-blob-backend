import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

export class MissionTwo extends AbstractMission {
  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);
  }

  wrap_up() {}
}
