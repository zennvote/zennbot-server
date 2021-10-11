import { redis } from '../infrastructure/redis';
import { io } from '../infrastructure/socket';

export enum RequestType {
  ticket = '티켓',
  ticketPiece = '조각',
  freemode = '골든벨',
  manual = 'manual',
}

export default class Song {
  constructor(
    public title: string,
    public requestor: string,
    public requestorName: string,
    public requestType: RequestType,
  ) {}
}

const getSongFromRedis = (key: string): Promise<Song[]> => new Promise<Song[]>((resolve) => {
  redis.get(key, (err, reply) => {
    if (err || !reply) {
      return resolve([]);
    }
    return resolve(JSON.parse(reply) as Song[]);
  });
});

export const getSongList = (): Promise<Song[]> => getSongFromRedis('songs/list');
export const getDequeuedSongList = (): Promise<Song[]> => getSongFromRedis('songs/dequeued-list');

export const setSongList = (songs: Song[]): void => {
  redis.set('songs/list', JSON.stringify(songs));
  io.emit('songs.updated', songs);
};

export const setDequeuedSongList = (songs: Song[]): void => {
  redis.set('songs/dequeued-list', JSON.stringify(songs));
};
