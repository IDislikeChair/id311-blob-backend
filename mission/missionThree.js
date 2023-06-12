import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

class TargetDummy {
  #MAX_HEALTH_POINT = 10;

  constructor(playerNumber) {
    this.playerNumber = playerNumber;
    this.healthPoint = this.#MAX_HEALTH_POINT;
  }

  get_remaining_health_ratio() {
    return this.healthPoint / this.#MAX_HEALTH_POINT;
  }
}

class Vector2 {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class MissionThree extends AbstractMission {
  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);
  }

  wrap_up() {}
}
