import { AbstractMission } from '../abstractMission.js';
import { Emcee } from '../emcee.js';
import { PlayerMgr } from '../playerMgr.js';

export class MissionOne extends AbstractMission {
  #playerMissionStatuses;

  /**
   * @param {Emcee} emcee
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, playerMgr) {
    super(emcee, playerMgr);

    this.#playerMissionStatuses = [];
    for (let i = 0; i < 6; i++) {
      this.#playerMissionStatuses[i] = {
        pNum: i,
        pName: playerMgr.get_player_name(i),
        alive: playerMgr.is_player_alive(i),
        steps: 0,
      };
    }

    this.playerMgr.on_any_alive_player('stepOn', (player_number, steps) => {
      this.#playerMissionStatuses[player_number].steps = steps;
      this.emcee.emit('broadcastStepCounts', this.#playerMissionStatuses);
    });
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
