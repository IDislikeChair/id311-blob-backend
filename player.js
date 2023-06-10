import { Client } from './client.js';
import { PlayerStatus } from './enum.js';
import { PlayerMgr } from './playerMgr.js';

export class Player {
  /** @type {Client} */
  #client;

  /** @type {string} */
  name;

  /** @type {PlayerMgr} */
  #player_mgr;

  /** @type {boolean} */
  is_alive;

  /** @type {number} */
  score;

  /**
   * @param {Client} phone_client
   * @param {string} name
   * @param {PlayerMgr} player_mgr
   */
  constructor(phone_client, name, player_mgr) {
    this.#client = phone_client;
    this.#client.setOwner(this);
    this.name = name;
    this.#player_mgr = player_mgr;

    this.is_alive = true;
    this.score = 0;
  }

  // Public methods

  /**
   * @returns {PlayerStatus}
   */
  get_status() {
    return this.#client.emit('get_status');
  }

  start_pre_mission(mission_id) {
    // First check if player is idling.
    // if (this.get_status() !== PlayerStatus.IDLE) {
    //   throw new Error('Player is not idling, start_pre_mission.');
    // }

    this.#client.emit('start_pre_mission', { mission_id: mission_id });
  }

  /**
   * @param {number} mission_id
   * @param {number} end_timestamp
   */
  start_mission(mission_id, end_timestamp) {
    // First check if player is idling.
    // if (this.get_status() !== PlayerStatus.IDLE) {
    //   throw new Error('Player is not idling, start_mission.');
    // }

    this.#client.emit('start_mission', {
      mission_id: mission_id,
      end_timestamp: end_timestamp,
    });
  }

  /**
   * @param {any} mission_id
   */
  start_post_mission(mission_id) {
    // Force mission to end.
    this.#client.emit('start_post_mission', {
      mission_id: mission_id,
    });
  }

  /**
   * @param {number} mission_id
   */
  async get_mission_result(mission_id) {
    // help (;-;)
    const value = await new Promise((resolve, _) => {
      // (1) request the result by emitting get_mission_result.
      this.#client.emit('get_mission_result', mission_id);
      let is_response_received = false;

      // (2) try listening for a response, resolve with the data.
      this.#client.on('post_mission_result', (data) => {
        is_response_received = true;
        resolve(data);
      });

      // (3) no response received after 5 seconds, resolve with null;
      setTimeout(() => {
        if (!is_response_received) resolve(null);
      }, 5000);
    });

    // (4) return resolved value.
    return value;
  }

  start_end_screen() {
    this.#client.emit('start_end_screen');
  }

  end_session() {
    this.#client.disconnect();
  }

  /**
   * @param {any} event
   * @param {any[]} args
   */
  emit(event, ...args) {
    this.#client.emit(event, ...args);
  }

  /**
   * @param {any} event
   * @param {any} callback
   */
  on(event, callback) {
    this.#client.on(event, callback);
  }

  // Interface methods

  on_client_disconnect() {
    this.#player_mgr.remove_player(this);
  }
}
