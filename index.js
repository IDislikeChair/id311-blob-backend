import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A new client has connected.');

  socket.emit('message', 'Connected to server');

  socket.on('message', (message) => {
    if (message == 'ping') {
      socket.emit('message', 'pong');
    }
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected.');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
