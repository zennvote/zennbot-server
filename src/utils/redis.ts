import { redis } from '..';
import Song from '../models/songs.model';

export const getSongList = (key: string): Promise<Song[]> => new Promise<Song[]>((resolve) => {
  redis.get(key, (err, reply) => {
    if (err || !reply) {
      return resolve([]);
    }

    return resolve(JSON.parse(reply) as Song[]);
  });
});
