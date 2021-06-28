import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Redis from 'redis';
import { Server } from 'socket.io';

import SongsRouter from './controllers/songs.controller';

import { initializeSheetsService } from './utils/sheets';
import { initializeChatbot } from './utils/chatbot';
import { getSongList } from './models/songs.model';
import { client } from 'tmi.js';

dotenv.config();

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/songs', SongsRouter);

const initializers = [
  initializeSheetsService(),
  initializeChatbot(),
];

export const io = new Server();
export const redis = Redis.createClient();

io.on('connection', (socket: any) => {
  socket.on('songs.update', async () => {
    io.emit('songs.updated', await getSongList());
  });
  console.log(`connected: ${socket.id}`);
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
