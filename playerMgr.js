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
      if (player.is_alive()) {
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
      if (player.is_alive()) {
        player.start_mission(mission_id, Date.now() + duration);
      }
    }
  }

  start_post_mission(mission_id) {
    for (const player of this.#players) {
      if (player.is_alive()) {
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
        player.set_dead();
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
    return !this.#players.some((player) => player.get_name() === name);
  }

  /**
   * @param {import("./client.js").Client} client
   * @param {string} name
   */
  create_new_player(client, name) {
    const new_player_number = this.#players.length;
    const new_player = new Player(client, name, new_player_number, this);
    this.#players.push(new_player);
    return new_player;
  }

  /**
   * @param {Player} player
   */
  remove_player(player) {
    this.#players = this.#players.filter((p) => p !== player);
  }

  /**
   * @param {number} player_number
   */
  set_player_dead(player_number) {
    if (this.#players[player_number]) {
      this.#players[player_number].set_dead();
    }
  }

  /**
   * @param {string} event
   * @param {any[]} args
   */
  emit_to_all_players(event, ...args) {
    for (const player of this.#players) {
      player.emit(event, ...args);
    }
  }

  /**
   * @param {string} event
   * @param {(player_number: number, message: any) => void} callback
   */
  on_any_player(event, callback) {
    for (const player of this.#players) {
      player.on(event, (/** @type {any} */ individual_message) =>
        callback(player.get_player_number(), individual_message)
      );
    }
  }

  /**
   * @param {string} event
   * @param {any[]} args
   */
  emit_to_alive_players(event, ...args) {
    for (const player of this.#players) {
      if (player.is_alive()) {
        player.emit(event, ...args);
      }
    }
  }

  /**
   * @param {string} event
   * @param {(player_number: number, message: any) => void} callback
   */
  on_any_alive_player(event, callback) {
    for (const player of this.#players) {
      if (player.is_alive()) {
        player.on(event, (/** @type {any} */ individual_message) =>
          callback(player.get_player_number(), individual_message)
        );
      }
    }
  }

  /**
   * @param {number} player_number
   * @param {any} event
   * @param {any[]} args
   */
  emit_to_player(player_number, event, ...args) {
    if (player_number > 5)
      console.warn(
        `playerMgr.emit_to_player: player_number ${player_number} is more than 5`
      );

    const player = this.#players[player_number];
    if (player) {
      player.emit(event, ...args);
    }
  }

  /**
   * @param {number} player_number
   * @param {any} event
   * @param {any} callback
   */
  on_player(player_number, event, callback) {
    if (player_number > this.#players.length - 1)
      console.warn(
        `playerMgr.on_player: player_number ${player_number} is more than the number of players ${
          this.#players.length - 1
        }`
      );

    const player = this.#players[player_number];
    if (player) {
      player.on(event, callback);
    }
  }

  /** @returns {Object[]} */
  get_status() {
    return this.#players.map((player) => ({
      pNum: player.get_player_number(),
      pName: player.get_name(),
      alive: player.is_alive(),
    }));
  }

  /**
   * @param {number} player_number
   * @returns {string}
   */
  get_player_name(player_number) {
    if (this.#players[player_number]) {
      return this.#players[player_number].get_name();
    } else {
      return 'EMPTY USER';
    }
  }

  /**
   *
   * @param {number} player_number
   * @returns {boolean}
   */
  is_player_alive(player_number) {
    if (this.#players[player_number]) {
      return this.#players[player_number].is_alive();
    } else {
      return false;
    }
  }
}
