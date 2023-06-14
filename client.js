import SOCKET_MGR from './socketMgr.js';

/**
 * @typedef IClientOwner
 * Interface for client owner. Client's socket event is delegated to it,
 * such as handling disconnection.
 * @property {() => void} on_client_disconnect
 */

/**
 * Class for controlling socket instance, and setting up common listeners.
 * Client must be set up with an owner, which implements IClientOwner.
 */
export default class Client {
  /** @type {IClientOwner} */
  #owner;

  /** @type {string} */
  #socketId;

  /**
   * @param {string} socketId
   */
  constructor(socketId) {
    this.#socketId = socketId;

    if (socketId === 'FAKE_SOCKET') return;

    const socket = SOCKET_MGR.get_socket_by_id(socketId);
    if (socket) {
      socket.on('disconnect', () => {
        if (this.#owner) {
          this.#owner.on_client_disconnect();
        }
      });
    } else {
      console.error(`Client.constructor: socket_id ${socketId} not found`);
    }
  }

  /**
   * @param {IClientOwner} owner
   */
  setOwner(owner) {
    this.#owner = owner;
  }

  /**
   * @param {any} event
   * @param {any[]} args
   */
  emit(event, ...args) {
    SOCKET_MGR.emit_to_socket_id(this.#socketId, event, ...args);
  }

  /**
   * @param {any} event
   * @param {any} callback
   */
  on(event, callback) {
    const socket = SOCKET_MGR.get_socket_by_id(this.#socketId);
    if (socket) {
      socket.on(event, callback);
    }
  }

  disconnect() {
    const socket = SOCKET_MGR.get_socket_by_id(this.#socketId);
    if (socket) {
      socket.disconnect();
    }
  }
}
