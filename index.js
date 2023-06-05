import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { SessionMgr } from './sessionMgr.js';
import { Client } from './client.js';

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const session_mgr = new SessionMgr();

io.on('connection', (socket) => {
  console.log('A new client has connected.');

  socket.on('message', (message) => {
    console.log('message');
  });

  socket.emit('choose_role');

  socket.on('join_as', (role, id, name) => {
    console.log(role);
    switch (role) {
      case 0:
        const emcee = new Client(socket);
        const new_session = session_mgr.create_new_session();
        new_session.add_client_as_emcee(emcee);
        socket.removeAllListeners('join_as');
        socket.emit('success_join_as_emcee', new_session.get_session_id());
        break;
      case 1:
        const player = new Client(socket);
        const session = session_mgr.get_session_by_id(id);
        if (session) {
          session.add_client_as_player(player, name);
          socket.removeAllListeners('join_as');
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

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
