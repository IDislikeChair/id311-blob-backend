import { Session } from './session.js';

const SESSION_ID_MIN = 1000;
const SESSION_ID_MAX = 9999;

export class SessionMgr {
  /** @type {Map<Number, Session>} */
  #sessions;

  constructor() {
    this.#sessions = new Map();
  }

  // Public methods

  /**
   * @returns {Session}
   */
  create_new_session() {
    const id = this.#get_new_random_id();
    const session = new Session(this, id);
    this.#sessions.set(id, session);
    return session;
  }

  /**
   * @param {number} id
   * @returns {Session | undefined}
   */
  get_session_by_id(id) {
    return this.#sessions.get(id);
  }

  /**
   * @param {{ get_session_id: () => number; }} session
   */
  remove_session(session) {
    this.#sessions.delete(session.get_session_id());
  }

  // Private methods

  #get_new_random_id() {
    const id =
      Math.floor(Math.random() * (SESSION_ID_MAX - SESSION_ID_MIN + 1)) +
      SESSION_ID_MIN;

    if (this.#sessions.has(id)) {
      return this.#get_new_random_id();
    } else {
      return id;
    }
  }
}
