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

class Target {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor() {
    this.x = 50;
    this.y = 50;
    this.target = { x: 50, y: 50 };
  }
}

export class MissionThree extends AbstractMission {
  #MOVE_RATE = 1;

  /** @type {number[]} */
  #alivePlayerNumbers;

  /** @type {Target[]} */
  #target;

  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);

    this.#alivePlayerNumbers = [];
    for (let i = 0; i < 6; i++) {
      if (this.playerMgr.is_player_alive(i)) {
        this.#alivePlayerNumbers.push(i);
      }
    }

    this.#target = {};
    this.#target[this.#alivePlayerNumbers[0]] = new Target();
    this.#target[this.#alivePlayerNumbers[1]] = new Target();

    for (let playerNum of this.#alivePlayerNumbers) {
      this.playerMgr.on_player(
        playerNum,
        'sendAcceleration',
        (xAcceleration, yAcceleration) => {
          this.#target[playerNum].x += xAcceleration * this.#MOVE_RATE;
          this.#target[playerNum].y += yAcceleration * this.#MOVE_RATE;
          if (this.#target[playerNum].x < 0) this.#target[playerNum].x = 0;
          if (this.#target[playerNum].x > 99) this.#target[playerNum].x = 99;
          if (this.#target[playerNum].y < 0) this.#target[playerNum].y = 0;
          if (this.#target[playerNum].y > 99) this.#target[playerNum].y = 99;

          console.log(
            'got acceleration from',
            playerNum,
            xAcceleration,
            yAcceleration
          );
          this.#broadcastStateToEmcee();
        }
      );

      this.playerMgr.on_player(playerNum, 'submitShot', () => {
        console.log('submitShot', playerNum, this.#target[playerNum]);
        if (this.#checkShot(pair)) {
          //
        } else {
          //
        }
      });
    }
  }

  /**
   * @param {Target} target
   */
  #checkShot(target) {
    return false;
  }

  #broadcastStateToEmcee() {
    this.emcee.emit('broadcastState', this.#target);
  }

  wrap_up() {}
}
