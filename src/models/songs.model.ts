import { io, redis } from '..';

import * as redisUtil from '../utils/redis';

export enum RequestType {
  ticket = '티켓',
  ticketPiece = '조각',
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

export const getSongList = (): Promise<Song[]> => redisUtil.getSongList('songs/list');
export const getRemovedSongList = (): Promise<Song[]> => redisUtil.getSongList('songs/removed-list');

const setSongList = (songs: Song[]) => {
  redis.set('songs/list', JSON.stringify(songs));
  io.emit('songs.updated', songs);
};

const setRemovedSongList = (songs: Song[]) => {
  redis.set('songs/removed-list', JSON.stringify(songs));
};

export const isCooltime = async (username: string): Promise<boolean> => {
  const songList = await getSongList();
  const removedSongList = await getRemovedSongList();

  return [...removedSongList, ...songList]
    .reverse()
    .slice(0, 4)
    .some((song) => song.requestor === username);
};

export const isMaxSong = async (): Promise<boolean> => {
  const songList = await getSongList();

  return songList.length >= 12;
};

export const appendSong = async (song: Song): Promise<void> => {
  const songList = await getSongList();
  setSongList([...songList, song]);
};

export const deleteSong = async (index = 0): Promise<Song | null> => {
  const songList = await getSongList();
  const removedSongList = await getRemovedSongList();

  const current = [...songList];
  const deleted = current.splice(index, 1)[0];
  if (!deleted) {
    return null;
  }

  setRemovedSongList([...removedSongList, deleted]);
  setSongList(current);

  return deleted;
};
