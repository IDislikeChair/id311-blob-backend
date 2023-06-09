import { SessionMgr } from './sessionMgr.js';
import { Client } from './client.js';
import SOCKET_MGR from './socketMgr.js';

const session_mgr = new SessionMgr();

SOCKET_MGR.get_io().on('connection', (socket) => {
  console.log('A new client has connected.' + socket.id);

  socket.on('message', (message) => console.log(message));

  socket.on('join_as', (o) => {
    console.log('join as: ' + o);
    switch (o.role) {
      case 0:
        const emcee = new Client(socket.id);

        const new_session = session_mgr.create_new_session();
        new_session.add_client_as_emcee(emcee);

        socket.removeAllListeners('join_as');
        socket.emit('success_join_as_emcee', new_session.get_session_id());
        break;
      case 1:
        const player = new Client(socket.id);

        const session = session_mgr.get_session_by_id(
          parseInt(o['session_id'])
        );
        if (session) {
          session.add_client_as_player(player, o['player_name']);
          socket.removeAllListeners('join_as');
        } else {
          socket.emit('error', 'error_session_not_found');
        }
        break;
      default:
        socket.emit('error', 'error_invalid_role');
    }
  });
});
