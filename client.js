import { Socket } from 'socket.io';

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

  /**
   * @param {Socket} socket
   */
  constructor(socket) {
    /** @type {Socket} */
    this.socket = socket;

    socket.on('disconnect', () => {
      if (this.#owner) {
        this.#owner.on_client_disconnect();
      }
    });
  }

  /**
   * @param {IClientOwner} owner
   */
  setOwner(owner) {
    this.#owner = owner;
  }
}
