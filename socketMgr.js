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
      console.log(`socketMgr: Listening on port ${port}`)
    );
  }

  get_instance() {
    return SocketMgr.#instance;
  }

  /**
   * @param {string} socketId
   * @returns {Socket | undefined}
   */
  get_socket_by_id(socketId) {
    return SocketMgr.#io.sockets.sockets.get(socketId);
  }

  /**
   * @param {string} socketId
   * @param {any} event
   * @param {any[]} args
   */
  emit_to_socket_id(socketId, event, ...args) {
    SocketMgr.#io.to(socketId).emit(event, ...args);
  }
}

const SOCKET_MGR = new SocketMgr();

export default SOCKET_MGR;
