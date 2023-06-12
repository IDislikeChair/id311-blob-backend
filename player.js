import { Client, FakeClient } from './client.js';
import { PlayerMgr } from './playerMgr.js';

export class Player {
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

  /** @type {boolean} */
  #isAlive;

  /** @returns {boolean} */
  is_alive() {
    return this.#isAlive;
  }

  /** @returns {boolean} */
  is_dead() {
    return !this.is_alive();
  }

  set_alive() {
    this.#isAlive = true;
  }

  set_dead() {
    this.#isAlive = false;
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

    this.#isAlive = true;
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
   * @param {any} missionId
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
    this.#playerMgr.remove_player(this);
  }
}

export class FakePlayer extends Player {
  /**
   * @param {number} playerNumber
   * @param {PlayerMgr} playerMgr
   */
  constructor(playerNumber, playerMgr) {
    super(
      new FakeClient(),
      FakePlayer.#get_random_name() + '🤖',
      playerNumber,
      playerMgr
    );
  }

  static #get_random_name() {
    const names = [
      'Alan',
      'Bill',
      'Carl',
      'Dave',
      'Emmy',
      'Fran',
      'Guts',
      'Hank',
      'Ivan',
      'Jake',
      'Karl',
      'Liam',
      'Mark',
      'Nick',
      'Owen',
      'Paul',
      'Quin',
      'Rudy',
      'Sean',
      'Troy',
      'Utah',
      'Vern',
      'Wade',
      'Xing',
      'Yuri',
      'Zeus',
    ];
    return names[Math.floor(Math.random() * names.length)];
  }
}
