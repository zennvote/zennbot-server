import { redis } from '../infrastructure/redis';
import Song from '../models/songs.model.regacy';

export const getSongList = (key: string): Promise<Song[]> => new Promise<Song[]>((resolve) => {
  redis.get(key, (err, reply) => {
    if (err || !reply) {
      return resolve([]);
    }
    return resolve(JSON.parse(reply) as Song[]);
  });
});

export const getFreemode = () => new Promise<boolean>((resolve) => {
  redis.get('songs/freemode', (err, reply) => {
    if (err || !reply) {
      return resolve(false);
    }
    return resolve(JSON.parse(reply) as boolean);
  });
});
