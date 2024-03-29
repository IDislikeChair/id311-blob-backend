import SessionMgr from './sessionMgr.js';
import Client from './client.js';
import SOCKET_MGR from './socketMgr.js';

const sessionMgr = new SessionMgr();

SOCKET_MGR.get_io().on('connection', (socket) => {
  socket.on('message', (message) => console.log(message));

  socket.on('join_as', (msg) => {
    socket.emit('message', 'joining you.');

    switch (msg.role) {
      case 0:
        const emcee = new Client(socket.id);

        const new_session = sessionMgr.create_new_session();

        new_session.register_client_as_emcee(emcee);

        socket.removeAllListeners('join_as');
        socket.on('DEBUG_go_to_pre_mission', (id) => {
          new_session.start_pre_mission(id);
        });
        break;
      case 1:
        const player = new Client(socket.id);

        // TODO: Make parsing the client's responsibility
        const session = sessionMgr.get_session_by_id(
          parseInt(msg['sessionId'])
        );

        if (session) {
          session.try_register_client_as_player(player, msg['playerName']);
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
