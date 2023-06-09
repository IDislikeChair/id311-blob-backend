import { Socket } from 'socket.io';
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
 * @property {Socket} socket
 */
export class Client {
  /** @type {IClientOwner} */
  #owner;

  #socket_id;

  get_socket_id() {
    return this.#socket_id;
  }

  /**
   * @param {string} socket_id
   */
  constructor(socket_id) {
    /** @type {string}  */
    this.#socket_id = socket_id;

    const socket = SOCKET_MGR.get_socket_by_id(socket_id);
    if (socket) {
      socket.on('disconnect', () => {
        if (this.#owner) {
          this.#owner.on_client_disconnect();
        }
      });
    } else {
      console.error(`Client.constructor: socket_id ${socket_id} not found`);
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
    SOCKET_MGR.emit_to_socket_id(this.#socket_id, event, ...args);
  }

  /**
   * @param {any} event
   * @param {any} callback
   */
  on(event, callback) {
    const socket = SOCKET_MGR.get_socket_by_id(this.#socket_id);
    if (socket) {
      socket.on(event, callback);
    }
  }

  disconnect() {
    const socket = SOCKET_MGR.get_socket_by_id(this.#socket_id);
    if (socket) {
      socket.disconnect();
    }
  }
}
