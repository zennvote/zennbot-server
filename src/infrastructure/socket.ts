import { Server } from 'socket.io';

import { getSongList } from '../models/songs.model.regacy';

export const io = new Server();

io.on('connection', (socket) => {
  socket.on('songs.update', async () => {
    io.emit('songs.updated', await getSongList());
  });
  console.log(`connected: ${socket.id}`);
});
