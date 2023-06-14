import Client from './client.js';
import Session from './session.js';

export default class Emcee {
  /** @type {Client} */
  #client;

  /** @type {Session} */
  #session;

  /**
   * @param {Client} client
   * @param {Session} session
   */
  constructor(client, session) {
    this.#client = client;
    this.#client.setOwner(this);

    this.#session = session;

    // setup on next message
    this.#client.on('on_next', () => {
      this.#session.go_to_next_scene();
    });
  }

  // Public methods
  on_client_disconnect() {
    this.#session.on_emcee_disconnect();
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

  disconnect() {
    this.#client.disconnect();
  }
}
