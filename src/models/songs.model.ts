import { io } from "..";

export default class Song {
  constructor (
    public title: string,
    public requestor: string,
    public requestorName: string,
    public requestType: RequestType,
  ) {}
}

export enum RequestType {
  ticket = '티켓',
  ticketPiece = '조각',
  manual = 'manual',
}

let removedSongList: Song[] = [];
let songList: Song[] = [];

export const getSongList = () => songList;

const setSongList = (songs: Song[]) => {
  songList = songs;
  io.emit('songs.updated', songs);
};

export const isCooltime = async (username: string) => {
  return [...removedSongList, ...songList]
    .reverse()
    .slice(0, 4)
    .some((song) => song.requestor === username);
};

export const isMaxSong = async () => {
  return songList.length >= 12;
}

export const appendSong = async (song: Song) => setSongList([...songList, song]);

export const deleteSong = async (index: number = 0) => {
  const current = [...songList];
  const deleted = current.splice(index, 1)[0];
  removedSongList = [...removedSongList, deleted];
  setSongList(current);

  return deleted;
};
