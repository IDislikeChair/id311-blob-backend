import { Client } from './client.js';
import { Session } from './session.js';

export class Emcee {
  /** @type {Client} */
  client;

  /** @type {Session} */
  #session;

  /**
   * @param {Client} client
   * @param {Session} session
   */
  constructor(client, session) {
    this.client = client;
    this.client.setOwner(this);

    this.#session = session;
  }

  // Public methods
  on_client_disconnect() {
    this.#session.on_emcee_disconnect();
  }
}
