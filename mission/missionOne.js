import { AbstractMission } from '../abstractMission.js';
import { Emcee } from '../emcee.js';
import { PlayerMgr } from '../playerMgr.js';

export class MissionOne extends AbstractMission {
  /** @type {Object.<number, Object.<string, number>>} */
  #player_statuses;

  /**
   * @param {Emcee} emcee
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, playerMgr) {
    super(emcee, playerMgr);

    // TODO: refactor this.
    this.#player_statuses = {
      0: { steps: 0 },
      1: { steps: 0 },
      2: { steps: 0 },
      3: { steps: 0 },
      4: { steps: 0 },
      5: { steps: 0 },
    };

    this.playerMgr.on_any_alive_player('stepOn', (player_number, steps) => {
      this.#player_statuses[player_number] = steps;
      this.playerMgr.emit_to_player(player_number, 'getMyStepCounts', steps);
      this.emcee.emit('broadcastStepCounts', this.#player_statuses);
    });

    setInterval('broadcastPlayerStatus', 100);
  }

  get_duration() {
    return 10000;
  }

  // this will be called after the duration above is expired.
  // AKA When mission ends.
  run() {
    // Example interface
    // this.emcee.emit('missionOne', 'success');
    // this.playerMgr.emit_to_all_players('message', 'Hello players');
    // this.playerMgr.emit_to_alive_players('message', 'Hello alive players');
    // this.emcee.on('message', (message) => {
    //   console.log(message);
    // });
    // this.playerMgr.on_any_player('message', (message) => {
    //   console.log(message);
    // });
    // this.playerMgr.on_any_alive_player('message', (message) => {
    //   console.log(message);
    // });
    // this.playerMgr.emit_to_player(
    //   0,
    //   'message',
    //   'Hello player 0. You will be dead'
    // );
    // this.playerMgr.set_player_dead(0);
  }
}
