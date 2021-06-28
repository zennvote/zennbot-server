import { redis } from "..";
import Song from "../models/songs.model";

export const getSongList = (key: string) => new Promise<Song[]>((resolve) => {
  redis.get(key, (err, reply) => {
    if (err || !reply) {
      return resolve([]);
    }
    console.log(reply);
    return resolve(JSON.parse(reply) as Song[]);
  })
});
