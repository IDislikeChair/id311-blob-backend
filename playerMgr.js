import { Player } from './player.js';

export class PlayerMgr {
  /** @type {Player[]} */
  #players;

  constructor() {
    this.#players = [];
  }

  // Public methods

  /**
   * @param {number} mission_id
   */
  start_pre_mission(mission_id) {
    for (const player of this.#players) {
      if (player.is_alive) {
        player.start_pre_mission(mission_id);
      }
    }
  }

  /**
   * @param {number} mission_id
   * @param {number} duration in milliseconds
   */
  start_mission(mission_id, duration) {
    for (const player of this.#players) {
      if (player.is_alive) {
        player.start_mission(mission_id, Date.now() + duration);
      }
    }
  }

  start_post_mission(mission_id) {
    for (const player of this.#players) {
      if (player.is_alive) {
        player.start_post_mission(mission_id);
      }
    }
  }

  /**
   * @param {number} mission_id
   * @param {function(Map<Player, Object>): Map<Player, boolean>} result_resolver
   */
  resolve_results(mission_id, result_resolver) {
    const player_to_result_map = new Map();
    for (const player of this.#players) {
      const result = player.get_mission_result(mission_id);
      player_to_result_map.set(player, result);
    }

    const player_to_success_map = result_resolver(player_to_result_map);

    for (const [player, success] of player_to_success_map) {
      if (success) {
        player.is_alive = false;
      }
    }
  }

  start_end_screen() {
    for (const player of this.#players) {
      player.start_end_screen();
    }
  }

  end_session() {
    for (const player of this.#players) {
      player.end_session();
    }
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
   * @param {Player} player
   */
  remove_player(player) {
    this.#players = this.#players.filter((p) => p !== player);
  }
}