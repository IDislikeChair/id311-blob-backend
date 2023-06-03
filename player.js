import { Client } from './client';
import { PlayerStatus } from './enum';
import { PlayerMgr } from './playerMgr';

export class Player {
  /** @type {Client} */
  client;

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
    this.client = phone_client;
    this.client.setOwner(this);
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
    return this.#get_socket().emit('get_status');
  }

  /**
   * @param {number} mission_id
   * @param {number} end_timestamp
   */
  start_mission(mission_id, end_timestamp) {
    // First check if player is idling.
    if (this.get_status() !== PlayerStatus.IDLE) {
      throw new Error('Player is not idling.');
    }

    this.#get_socket().emit('start_mission', {
      mission_id,
      end_timestamp,
    });
  }

  set_idle() {
    this.#get_socket().emit('set_idle');
  }

  // Interface methods

  on_client_disconnect() {
    this.#player_mgr.remove_player(this);
  }

  // Private utility methods

  #get_socket() {
    return this.client.socket;
  }
}
