import { Client } from './client';
import { SessionMgr } from './sessionMgr';
import SOCKET_MGR from './socketMgr';

class ClientMgr {
  /** @type {SessionMgr} */
  #session_mgr;

  /**
   * @param {SessionMgr} session_mgr
   */
  constructor(session_mgr) {
    this.#session_mgr = session_mgr;

    SOCKET_MGR.get_io().on('connection', (socket) => {
      console.log(
        `clientMgr.constructor: A new client has connected. ID: ${socket.id}`
      );

      socket.on('message', (message) => {
        console.log(
          `clientMgr.constructor: message from ${socket.id}: ${message}`
        );
      });

      socket.on('join_as', (o) => {
        console.log(`clientMgr.constructor: join_as: ${o}`);
        switch (o.role) {
          case 0:
            const emcee = new Client(socket.id);
            const new_session = session_mgr.create_new_session();
            new_session.add_client_as_emcee(emcee);
            socket.emit('success_join_as_emcee', new_session.get_session_id());
            break;
          case 1:
            console.log(socket.id);
            const player = new Client(socket.id);
            const session = session_mgr.get_session_by_id(
              parseInt(o['session_id'])
            );
            if (session) {
              session.add_client_as_player(player, o['player_name']);
              socket.emit('success_join_as_player');
            } else {
              socket.emit('error_session_not_found');
            }
            break;
          default:
            socket.emit('error_invalid_role');
        }
      });
    });
  }

  /**
   * @param {string} socket_id
   */
  #create_emcee_client(socket_id) {
    const emcee = new Client(socket_id);
    const new_session = this.#session_mgr.create_new_session();
    new_session.add_client_as_emcee(emcee);
    SOCKET_MGR.emit_to_socket_id(socket_id, 'success_join_as_emcee', {
      session_id: new_session.get_session_id(),
    });
    return new_session.get_session_id();
  }
}
