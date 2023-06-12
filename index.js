import { SessionMgr } from './sessionMgr.js';
import { Client } from './client.js';
import SOCKET_MGR from './socketMgr.js';

const session_mgr = new SessionMgr();
let players = {};
let joined_players = 0;

SOCKET_MGR.get_io().on('connection', (socket) => {
  socket.on('message', (message) => console.log(message));

  socket.on('beTilted', (amount) => {
    players[socket.id].tilts = amount;
    socket.emit('getMyTiltedAmount', players[socket.id].tilts);
  });

  socket.on('join_as', (msg) => {
    socket.emit('message', 'joining you.');

    switch (msg.role) {
      case 0:
        const emcee = new Client(socket.id);

        const new_session = session_mgr.create_new_session();
        new_session.try_register_client_as_emcee(emcee);

        socket.removeAllListeners('join_as');
        socket.on('DEBUG_go_to_pre_mission', (id) => {
          new_session.start_pre_mission(id);
        });
        break;
      case 1:
        const player = new Client(socket.id);

        // TODO: Make parsing the client's responsibility
        const session = session_mgr.get_session_by_id(
          parseInt(msg['session_id'])
        );

        if (session) {
          session.try_register_client_as_player(player, msg['player_name']);
          socket.removeAllListeners('join_as');

          players[socket.id] = {
            pNum: joined_players++,
            pName: msg['player_name'],
            steps: 0,
            tilts: 0,
            alive: true,
          };
        } else {
          socket.emit('error', 'error_session_not_found');
        }
        break;
      default:
        socket.emit('error', 'error_invalid_role');
    }
  });
});
