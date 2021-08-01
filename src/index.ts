import express, { Application } from 'express';
import cors from 'cors';
import Redis from 'redis';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import { config } from './utils/config';

import SongsRouter from './controllers/songs.controller';
import FlagsRouter from './controllers/flags.controller';

import { initializeSheetsService } from './utils/sheets';
import { initializeChatbot } from './utils/chatbot';
import { getSongList } from './models/songs.model';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/songs', SongsRouter);
app.use('/api/flags', FlagsRouter);

const initializers = [
  initializeSheetsService(),
  initializeChatbot(),
];

export const io = new Server();
export const redis = Redis.createClient();

redis.set('songs/removed-list', '[]');
redis.set('songs/list', '[]');

io.on('connection', (socket) => {
  socket.on('songs.update', async () => {
    io.emit('songs.updated', await getSongList());
  });
  console.log(`connected: ${socket.id}`);
});

mongoose.connect(config.mongo.uri ?? '', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to ', config.mongo.uri);
  })
  .catch((err) => {
    console.error(err);
  });

Promise.all(initializers)
  .then(() => {
    app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
    });

    io.listen(4000, { transports: ['websocket'] });
  })
  .catch((error) => {
    console.error(`Error occured: ${error?.message}`);
  });
