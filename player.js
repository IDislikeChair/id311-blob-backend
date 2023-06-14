import Client from './client.js';
import PlayerMgr from './playerMgr.js';

export default class Player {
  /** @type {PlayerMgr} */
  #playerMgr;

  /** @type {Client} */
  #client;

  /** @type {string} */
  #name;

  /** @returns {string} */
  get_name() {
    return this.#name;
  }

  /** @type {number} */
  #playerNumber;

  /** @returns {number} */
  get_number() {
    return this.#playerNumber;
  }

  /** @type {number} */
  #missionDiedIn;

  /** @returns {boolean} */
  is_alive() {
    return this.#missionDiedIn === 0;
  }

  /** @returns {number} */
  get_progress() {
    return this.#missionDiedIn;
  }

  /** @returns {boolean} */
  is_dead() {
    return !this.is_alive();
  }

  /**
   * @param {number} mission_id
   */
  set_dead(mission_id) {
    this.#missionDiedIn = mission_id;
  }

  /**
   * @param {Client} phoneClient
   * @param {string} name
   * @param {number} playerNumber [0-5]
   * @param {PlayerMgr} playerMgr
   */
  constructor(phoneClient, name, playerNumber, playerMgr) {
    this.#client = phoneClient;
    this.#client.setOwner(this);

    this.#name = name;
    this.#playerNumber = playerNumber;
    this.#playerMgr = playerMgr;

    this.#missionDiedIn = 0;
  }

  // Public methods
  /**
   * @param {number} missionId
   */
  start_pre_mission(missionId) {
    this.#client.emit('start_pre_mission', { missionId: missionId });
  }

  /**
   * @param {number} missionId
   */
  start_mission(missionId) {
    this.#client.emit('start_mission', {
      missionId: missionId,
    });
  }

  /**
   * @param {number} missionId
   */
  start_post_mission(missionId) {
    // Force mission to end.
    this.#client.emit('start_post_mission', {
      missionId: missionId,
    });
  }

  start_end_screen() {
    this.#client.emit('start_end_screen');
  }

  end_session() {
    this.#client.disconnect();
  }

  /**
   * @param {string} event
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

  on_client_disconnect() {}
}
