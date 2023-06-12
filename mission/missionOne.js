import { AbstractMission } from '../abstractMission.js';
import { GameFlowMgr } from '../gameFlowMgr.js';

export class MissionOne extends AbstractMission {
  #MAX_WINNER_COUNT = 4;

  /** @type {number[]} */
  #stepCounts;

  /** @type {number[]} */
  winnerNumbers;

  #is_done = false;

  /**
   * @param {GameFlowMgr} gameFlowMgr
   */
  constructor(gameFlowMgr) {
    super(gameFlowMgr);

    this.#stepCounts = [0, 0, 0, 0, 0, 0];
    this.winnerNumbers = [];

    this.playerMgr.on_any_alive_player('stepOn', (playerNumber, steps) => {
      if (!this.winnerNumbers.includes(playerNumber)) {
        this.#stepCounts[playerNumber] = steps;
      }

      this.emcee.emit('broadcastStepCounts', this.#stepCounts);
    });

    this.emcee.on(
      'playersReach',
      (/** @type {number[]} */ newWinnerNumbers) => {
        this.winnerNumbers = newWinnerNumbers;

        if (
          this.winnerNumbers.length === this.#MAX_WINNER_COUNT &&
          !this.#is_done
        ) {
          this.#is_done = true;
          this.gameFlowMgr.on_next();
        }
      }
    );
  }

  wrap_up() {
    // Take the index of max of stepCounts until there are #MAX_WINNER_COUNT
    const notWiningPlayerNumbers = [0, 1, 2, 3, 4, 5].filter(
      (n) => !this.winnerNumbers.includes(n)
    );

    notWiningPlayerNumbers.sort(
      (a, b) => this.#stepCounts[a] - this.#stepCounts[b]
    );

    while (this.winnerNumbers.length < this.#MAX_WINNER_COUNT) {
      this.winnerNumbers.push(notWiningPlayerNumbers.pop());
    }

    // Set the rest of players dead.
    for (let playerNumber = 0; playerNumber < 6; playerNumber++) {
      if (!this.winnerNumbers.includes(playerNumber)) {
        this.playerMgr.set_player_dead(playerNumber);
      }
    }

    console.log(
      `MissionOne.wrap_up: Winners from this round are ${this.winnerNumbers}`
    );
  }
}
