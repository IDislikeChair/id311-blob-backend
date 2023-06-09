import { AbstractMission } from '../abstractMission.js';
import { Emcee } from '../emcee.js';
import { PlayerMgr } from '../playerMgr.js';

export class MissionOne extends AbstractMission {
  /**
   * @param {Emcee} emcee
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, playerMgr) {
    super(emcee, playerMgr);
  }

  get_duration() {
    return 10000;
  }

  // this will be called after the duration above is expired.
  run() {
    this.emcee.emit('missionOne', 'success');
    this.playerMgr.emit_to_all_players('message', 'Hello players');
    this.playerMgr.emit_to_alive_players('message', 'Hello alive players');

    this.emcee.on('message', (message) => {
      console.log(message);
    });
    this.playerMgr.on_any_player('message', (message) => {
      console.log(message);
    });
    this.playerMgr.on_any_alive_player('message', (message) => {
      console.log(message);
    });

    this.playerMgr.emit_to_player(
      0,
      'message',
      'Hello player 0. You will be dead'
    );
    this.playerMgr.set_player_dead(0);
  }
}
