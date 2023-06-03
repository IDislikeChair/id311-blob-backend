import { PlayerStatus } from './enum';
import { Player } from './player';

export class PlayerMgr {
  /** @type {Player[]} */
  #players;

  constructor() {
    this.#players = [];
  }

  // Public methods

  /**
   * @param {any} mission_id
   * @param {any} duration in milliseconds
   */
  start_mission(mission_id, duration) {
    for (const player of this.#players) {
      if (player.is_alive) {
        player.start_mission(mission_id, Date.now() + duration);
      }
    }

    setTimeout(() => {
      this.#end_mission(), duration;
    });
  }

  /**
   * @param {string} name
   * @returns {boolean}
   */
  is_name_unused(name) {
    return !this.#players.some((player) => player.name === name);
  }

  /**
   * @param {Player} player
   */
  add_player(player) {
    this.#players.push(player);
  }

  /**
   * @param {any} ev
   * @param {any[]} args
   */
  emit_to_all_players(ev, ...args) {
    for (const player of this.#players) {
      player.client.socket.emit(ev, ...args);
    }
  }

  /**
   * @param {Player} player
   */
  remove_player(player) {
    this.#players = this.#players.filter((p) => p !== player);
  }

  // Private methods

  #end_mission() {
    for (const player of this.#players) {
      if (player.get_status() !== PlayerStatus.SUCCESS) {
        player.is_alive = false;
      }

      player.set_idle();
    }
  }
}
