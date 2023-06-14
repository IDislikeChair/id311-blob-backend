import Client from './client.js';
import FakePlayer from './fakePlayer.js';
import Player from './player.js';

export default class PlayerMgr {
  /** @type {Player[]} */
  #players;

  constructor() {
    this.#players = [];
  }

  // Public methods

  /**
   * @param {number} missionId
   */
  start_pre_mission(missionId) {
    for (const player of this.#players) {
      player.start_pre_mission(missionId);
    }
  }

  /**
   * @param {number} missionId
   */
  start_mission(missionId) {
    for (const player of this.#players) {
      player.start_mission(missionId);
    }
  }

  /**
   * @param {number} missionId
   */
  start_post_mission(missionId) {
    for (const player of this.#players) {
      player.start_post_mission(missionId);
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
   * @param {Client} client
   * @param {string} name
   */
  create_new_player(client, name) {
    const new_playerNumber = this.#players.length;
    const new_player = new Player(client, name, new_playerNumber, this);
    this.#players.push(new_player);

    if (this.#players.length > 6) {
      console.warn('playerMgr.create_new_player: more than 6 players created.');
    }

    return new_player;
  }

  /**
   * @param {Player} player
   */
  remove_player(player) {
    this.#players = this.#players.filter((p) => p !== player);
  }

  /**
   * @param {number} playerNumber
   * @param {number} mission_id
   */
  set_player_dead(playerNumber, mission_id) {
    if (this.#players[playerNumber]) {
      this.#players[playerNumber].set_dead(mission_id);
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
   * @param {(playerNumber: number, message: any) => void} handler
   */
  on_any_player(event, handler) {
    for (const player of this.#players) {
      player.on(event, (/** @type {any} */ individual_message) =>
        handler(player.get_number(), individual_message)
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
   * @param {(playerNumber: number, message: any) => void} handler
   */
  on_any_alive_player(event, handler) {
    for (const player of this.#players) {
      if (player.is_alive()) {
        player.on(event, (/** @type {any} */ individual_message) =>
          handler(player.get_number(), individual_message)
        );
      }
    }
  }

  /**
   * @param {number} playerNumber
   * @param {any} event
   * @param {any[]} args
   */
  emit_to_player(playerNumber, event, ...args) {
    if (playerNumber > 5)
      console.warn(
        `playerMgr.emit_to_player: playerNumber ${playerNumber} is more than 5`
      );

    const player = this.#players[playerNumber];
    if (player) {
      player.emit(event, ...args);
    }
  }

  /**
   * @param {number} playerNumber
   * @param {any} event
   * @param {any} callback
   */
  on_player(playerNumber, event, callback) {
    if (playerNumber > this.#players.length - 1)
      console.warn(
        `playerMgr.on_player: playerNumber ${playerNumber} is more than the number of players ${
          this.#players.length - 1
        }`
      );

    const player = this.#players[playerNumber];
    if (player) {
      player.on(event, callback);
    }
  }

  /** @returns {Object[]} */
  get_status() {
    return this.#players.map((player) => ({
      pNum: player.get_number(),
      pName: player.get_name(),
      alive: player.get_progress(),
    }));
  }

  /**
   * @param {number} playerNumber
   * @returns {string}
   */
  get_player_name(playerNumber) {
    if (this.#players[playerNumber]) {
      return this.#players[playerNumber].get_name();
    } else {
      return 'Player';
    }
  }

  /**
   *
   * @param {number} playerNumber
   * @returns {boolean}
   */
  is_player_alive(playerNumber) {
    if (this.#players[playerNumber]) {
      return this.#players[playerNumber].is_alive();
    } else {
      return false;
    }
  }

  fill_with_fake_players_until_six_players() {
    while (this.#players.length < 6) {
      const fake_player = new FakePlayer(this.#players.length, this);
      this.#players.push(fake_player);
    }
  }
}
