import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();

let stepCount = 0;
let curBallPos = 0;

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

  socket.on('stepOn', (steps) => {
    stepCount = steps;
    io.emit('broadcastStepCount', stepCount);
  });

  socket.on('getStepCount', () => {
    return stepCount;
  });

  socket.on('resetStepCount', () => {
    stepCount = 0;

    io.emit('broadcastStepCount', stepCount);
  });

  socket.on('tilt', (amount) => {
    console.log('tilt', amount);
    curBallPos += amount;
    if (curBallPos < 0) curBallPos = 0;
    else if (curBallPos > 300) curBallPos = 300;
    io.emit('broadcastBallPos', curBallPos);
  });

  socket.on('resetBallPos', () => {
    console.log('resetBallPos');
    curBallPos = 150;

    io.emit('broadcastBallPos', curBallPos);
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected.');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}`));
