import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

class SocketMgr {
  // Singleton pattern
  /** @type {SocketMgr} */
  static #instance;

  /** @type {Server} */
  static #io;

  static sockets;

  /**
   * @returns {Server}
   */
  get_io() {
    return SocketMgr.#io;
  }

  constructor() {
    if (SocketMgr.#instance) {
      return SocketMgr.#instance;
    }

    SocketMgr.#instance = this;

    const app = express();
    const server = http.createServer(app);
    app.use(cors());

    SocketMgr.#io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () =>
      console.log(`socketMgr.js: Listening on port ${port}`)
    );
  }

  get_instance() {
    return SocketMgr.#instance;
  }

  /**
   * @param {string} socket_id
   * @returns {Socket | undefined}
   */
  get_socket_by_id(socket_id) {
    return SocketMgr.#io.sockets.sockets.get(socket_id);
  }

  /**
   * @param {string | string[]} socket_id
   * @param {any} event
   * @param {any[]} args
   */
  emit_to_socket_id(socket_id, event, ...args) {
    SocketMgr.#io.to(socket_id).emit(event, ...args);
  }
}

const SOCKET_MGR = new SocketMgr();

export default SOCKET_MGR;
