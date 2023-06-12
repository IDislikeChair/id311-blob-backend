import { AbstractMission } from '../abstractMission.js';
import { Emcee } from '../emcee.js';
import { GameFlowMgr } from '../gameFlowMgr.js';
import { PlayerMgr } from '../playerMgr.js';

export class MissionOne extends AbstractMission {
  STEP_GOAL = 100;

  /** @type {number[]} */
  #stepCounts;

  /** @type {number[]} */
  #winner_numbers;

  /**
   * @param {Emcee} emcee
   * @param {GameFlowMgr} gameFlowMgr
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, gameFlowMgr, playerMgr) {
    super(emcee, gameFlowMgr, playerMgr);

    this.#stepCounts = [0, 0, 0, 0, 0, 0];
    this.#winner_numbers = [];

    this.playerMgr.on_any_alive_player('stepOn', (player_number, steps) => {
      if (!this.#winner_numbers.includes(player_number)) {
        this.#stepCounts[player_number] = steps;
      }

      this.emcee.emit('broadcastStepCounts', this.#stepCounts);
    });

    this.emcee.on('playersReach', (reachedPlayers) => {
      this.#winner_numbers = reachedPlayers;

      if (this.#winner_numbers.length === 4) {
        this.gameFlowMgr.on_next();
      }
    });
  }

  get_duration() {
    return 60 * 1000;
  }

  run() {
    // Take the index of max of stepCounts until there are 4 winners.
    while (this.#winner_numbers.length < 4) {
      this.#winner_numbers.push(
        this.#stepCounts.indexOf(Math.max(...this.#stepCounts))
      );
    }

    // Set the rest of players dead.
    for (let player_number = 0; player_number < 6; player_number++) {
      if (!(player_number in this.#winner_numbers)) {
        this.playerMgr.set_player_dead(player_number);
      }
    }

    console.log(
      `MissionOne player alive status: ${[0, 1, 2, 3, 4, 5].map(
        (player_number) => this.playerMgr.is_player_alive(player_number)
      )}`
    );
  }
}
