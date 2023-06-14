import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

class TargetDummy {
  // TODO: Find good distance between target and position.
  // this is in percentage.
  #SHOOTING_DISTANCE = 13;

  /**
   * @param {number} victimNumber
   */
  constructor(victimNumber) {
    this.victimNumber = victimNumber;
    this.victimHealthPoint = 5;

    this.cursorPosition = { x: 50, y: 50 };
    this.cursorMomentum = { x: 0, y: 0 };

    this.targetPosition = { x: NaN, y: NaN };
    this.generateNewTargetPosition();
  }

  generateNewTargetPosition() {
    // generate uniform random position between 0-99.
    this.targetPosition = {
      x: Math.random() * 100,
      y: Math.random() * 100,
    };
  }

  is_cursor_within_target_distance() {
    const dx = this.cursorPosition.x - this.targetPosition.x;
    const dy = this.cursorPosition.y - this.targetPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.#SHOOTING_DISTANCE;
  }
}

export class MissionThree extends AbstractMission {
  /** @type {number} in milliseconds */
  #GAME_TICK_TIME = 33;

  /** @type {number} */
  #MOVE_RATE = (0.3 * this.#GAME_TICK_TIME) / 200;

  /** @type {number[]} */
  #alivePlayerNumbers;

  /** @type {Object.<number, TargetDummy>} */
  #targetDummies;

  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);

    // (1) Get the list of alive players from previous missions.
    this.#alivePlayerNumbers = [];
    for (let i = 0; i < 6; i++) {
      if (this.playerMgr.is_player_alive(i)) {
        this.#alivePlayerNumbers.push(i);
      }
    }

    // (2) Create target for each player with the victim being the other.
    this.#targetDummies = {};
    this.#targetDummies[this.#alivePlayerNumbers[0]] = new TargetDummy(
      this.#alivePlayerNumbers[1]
    );
    this.#targetDummies[this.#alivePlayerNumbers[1]] = new TargetDummy(
      this.#alivePlayerNumbers[0]
    );

    // (3) Set interval for movement tick and Emcee broadcast.
    this.movementTickInterval = setInterval(() => {
      this.#calc_movement_tick();
    }, this.#GAME_TICK_TIME);

    this.broadcastPairInterval = setInterval(() => {
      this.#broadcast_state_to_emcee();
    }, 100);

    // (4) Set up listeners  for player input.
    for (let playerNum of this.#alivePlayerNumbers) {
      this.playerMgr.on_player(
        playerNum,
        'sendAcceleration',
        (
          /** @type {number} */ xAcceleration,
          /** @type {number} */ yAcceleration
        ) => {
          this.#targetDummies[0].cursorMomentum.x += xAcceleration;
          this.#targetDummies[0].cursorMomentum.y += yAcceleration;
        }
      );

      this.playerMgr.on_player(playerNum, 'submitShot', () => {
        console.log('submitShot', playerNum, this.#targetDummies[playerNum]);
        if (this.#targetDummies[playerNum].is_cursor_within_target_distance()) {
          this.#targetDummies[playerNum].victimHealthPoint -= 1;
          this.#targetDummies[playerNum].generateNewTargetPosition();
          this.emcee.emit('shotSuccess', playerNum);
        } else {
          this.emcee.emit('shotFail', playerNum);
        }

        this.#broadcast_state_to_emcee();
      });
    }
  }

  #calc_movement_tick() {
    for (let targetDummy of [
      this.#targetDummies[this.#alivePlayerNumbers[0]],
      this.#targetDummies[this.#alivePlayerNumbers[1]],
    ]) {
      // recalculate position by target's momentum.
      targetDummy.cursorPosition.x +=
        targetDummy.cursorMomentum.x * this.#MOVE_RATE;
      targetDummy.cursorPosition.y +=
        targetDummy.cursorMomentum.y * this.#MOVE_RATE;

      // limit range to from 0 to 99.
      if (targetDummy.cursorPosition.x < 0) targetDummy.cursorPosition.x = 0;
      if (targetDummy.cursorPosition.x > 99) targetDummy.cursorPosition.x = 99;
      if (targetDummy.cursorPosition.y < 0) targetDummy.cursorPosition.y = 0;
      if (targetDummy.cursorPosition.y > 99) targetDummy.cursorPosition.y = 99;
    }
  }

  #broadcast_state_to_emcee() {
    this.emcee.emit('broadcastMission3State', this.#targetDummies);
  }

  wrap_up() {}
}
