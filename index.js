import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();

let pingCount = 0;

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

io.on('connection', (socket) => {
  console.log('A new client has connected.');

  socket.emit('message', 'Connected to server');

  socket.on('message', (message) => {
    console.log('message');
  });

  socket.on('ping', () => {
    socket.emit('message', 'pong');

    pingCount++;

    socket.broadcast.emit('broadcastPingCount', pingCount);
  });

  socket.on('getPingCount', () => {
    return pingCount;
  });

  socket.on('resetPingCount', () => {
    pingCount = 0;

    socket.broadcast.emit('broadcastPingCount', pingCount);
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected.');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
