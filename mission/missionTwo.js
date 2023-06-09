import { AbstractMission } from '../abstractMission.js';
import { Emcee } from '../emcee.js';
import { PlayerMgr } from '../playerMgr.js';

export class MissionTwo extends AbstractMission {
  /** @type {number[]} */
  #ball_positions;

  /**
   * @param {Emcee} emcee
   * @param {PlayerMgr} playerMgr
   */
  constructor(emcee, playerMgr) {
    super(emcee, playerMgr);

    this.#ball_positions = [150, 150, 150, 150, 150, 150];

    this.playerMgr.on_any_alive_player('tilt', (msg) => {
      console.log('MissionTwo.tilt', msg.player_number, msg.amount);
      this.#ball_positions[msg.player_number] += msg.amount;
      this.emcee.emit('broadcastBallPositions', this.#ball_positions);
    });

    this.emcee.on('resetBallPos', () => {
      this.#ball_positions = [150, 150, 150, 150, 150, 150];
    });
  }

  get_duration() {
    return 10000;
  }

  // this will be called after the duration above is expired.
  run() {
    // this.emcee.emit('MissionTwo', 'success');
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
