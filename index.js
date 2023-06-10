import { SessionMgr } from './sessionMgr.js';
import { Client } from './client.js';
import SOCKET_MGR from './socketMgr.js';

const session_mgr = new SessionMgr();
const players = {};
let joined_players = 0;

SOCKET_MGR.get_io().on('connection', (socket) => {
  console.log('A new client has connected.' + socket.id);

  socket.on('message', (message) => console.log(message));
  socket.on('stepOn', (steps) => {
    console.log(
      `clientMgr.constructor: step from PLAYER ${
        players[socket.id].pNum
      }: ${steps}`
    );

    players[socket.id].steps = steps;
    socket.emit('getMyStepCounts', players[socket.id].steps);
  });
  socket.on('beTilted', (amount) => {
    console.log(
      `clientMgr.constructor: tilt from PLAYER ${
        players[socket.id].pNum
      }: ${amount}`
    );

    players[socket.id].tilts = amount;
    socket.emit('getMyTiltedAmount', players[socket.id].tilts);
  });

  setInterval(() => {
    socket.emit('broadcastPlayerStatus', players);
  }, 100);

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

          console.log('success_join_as_player');
          players[socket.id] = {
            pNum: joined_players++,
            pName: o['player_name'],
            steps: 0,
            tilts: 0,
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
